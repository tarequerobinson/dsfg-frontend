import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// In-memory cache (replace with Redis or database in production)
const cache = new Map<string, any>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  category: string | string[];
}

interface ExtractedEvent {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  eventType: string;
  company: string;
  eventDate: Date | null;
}

const EVENT_TYPE_MAPPING = {
  "General Meetings (AGM's)": "AGM",
  "Board Meeting": "Board Meeting",
  "Quarterly Financial Statements": "Earnings",
  "Stock Split": "Stock Split",
  "Rights Issue": "Rights Issue",
  "Initial Public Offering": "IPO",
  "Dividend Declaration (Payment)": "Dividend",
  "Dividend Considerations": "Dividend",
  "Merger & Acquisition": "Merger",
  "Corporate Governance Policy": "Corporate Event",
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  const cacheKey = "jse-events";
  const cachedData = cache.get(cacheKey);

  // Return cached data if available and not expired
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedData.data);
  }

  try {
    // Fetch JSE RSS feed
    const jamstockexResponse = await fetch(
      "https://api.allorigins.win/raw?url=" +
        encodeURIComponent("https://www.jamstockex.com/feed/")
    );

    if (!jamstockexResponse.ok) {
      throw new Error("Failed to fetch JSE feed");
    }

    const xmlData = await jamstockexResponse.text();

    // Parse the XML using fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
    });

    const jsonObj = parser.parse(xmlData);
    const rssItems = jsonObj.rss.channel.item;

    const events = await parseAndCategorizeEvents(rssItems);

    // Cache the results
    const responseData = { jamstockex: xmlData, events };
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in JSE events API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch and process RSS feeds",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function parseAndCategorizeEvents(items: RssItem[]): Promise<ExtractedEvent[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const extractedEvents: ExtractedEvent[] = [];
  const batchSize = 5; // Process 5 items per API call to stay under rate limits

  // Batch items
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    // Create a single prompt for the batch
    const prompt = batch
      .map(
        (item, index) => `
      Item ${index + 1}:
      Analyze this JSE announcement and extract the following information:
      1. Company name
      2. Event type (AGM, Board Meeting, Earnings, Stock Split, Rights Issue, IPO, Dividend, Merger, Acquisition, or Corporate Event)
      3. Event date (if mentioned)
      4. Any specific details about the event

      Title: ${item.title}
      Description: ${item.description}
      Categories: ${Array.isArray(item.category) ? item.category.join(", ") : item.category || ""}
    `
      )
      .join("\n\n");

    try {
      // Retry logic with exponential backoff
      let retries = 3;
      let delay = 1000; // Start with 1 second delay

      while (retries > 0) {
        try {
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });

          const analysis = await result.response.text();
          const batchResults = parseGeminiBatchResponse(analysis, batch.length);

          // Process each result
          batch.forEach((item, index) => {
            const eventDetails = batchResults[index] || {
              company: extractCompanyName(item.title),
              eventType: determineEventType(
                Array.isArray(item.category) ? item.category : [item.category || ""]
              ),
              eventDate: extractDateFromContent(item.description),
            };

            extractedEvents.push({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              description: item.description,
              eventType: eventDetails.eventType,
              company: eventDetails.company,
              eventDate: eventDetails.eventDate,
            });
          });

          break; // Success, exit retry loop
        } catch (error: any) {
          if (error.status === 429 && retries > 0) {
            console.warn(`Rate limit hit, retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            retries--;
          } else {
            console.error("Error analyzing batch with Gemini:", error);
            // Fallback for the entire batch
            batch.forEach((item) => {
              extractedEvents.push({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                description: item.description,
                eventType: determineEventType(
                  Array.isArray(item.category) ? item.category : [item.category || ""]
                ),
                company: extractCompanyName(item.title),
                eventDate: extractDateFromContent(item.description),
              });
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error processing batch:", error);
      // Fallback for the entire batch
      batch.forEach((item) => {
        extractedEvents.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: item.description,
          eventType: determineEventType(
            Array.isArray(item.category) ? item.category : [item.category || ""]
          ),
          company: extractCompanyName(item.title),
          eventDate: extractDateFromContent(item.description),
        });
      });
    }

    // Add a small delay between batches to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return extractedEvents;
}

function parseGeminiBatchResponse(response: string, batchSize: number): Array<{
  company: string;
  eventType: string;
  eventDate: Date | null;
}> {
  const results: Array<{ company: string; eventType: string; eventDate: Date | null }> = [];

  // Split response by "Item X:" to separate batch results
  const itemResponses = response.split(/Item \d+:/).slice(1);

  for (let i = 0; i < batchSize; i++) {
    const itemResponse = itemResponses[i] || "";
    try {
      // Extract company name
      const companyMatch = itemResponse.match(/Company name:?\s*([^(]+?)(?:\s*\([A-Z]+\))?\s*(?:\n|$)/i);
      const company = companyMatch ? companyMatch[1].trim() : "";

      // Extract event type
      const eventTypeMatch = itemResponse.match(/Event type:?\s*([^,\n]+)/i);
      const eventType = eventTypeMatch ? eventTypeMatch[1].trim() : "";

      // Extract date
      const dateMatch = itemResponse.match(/Event date:?\s*([^,\n]+)/i);
      const eventDate = dateMatch ? new Date(dateMatch[1]) : null;

      results.push({
        company,
        eventType,
        eventDate: !isNaN(eventDate?.getTime() || 0) ? eventDate : null,
      });
    } catch (error) {
      console.error(`Error parsing Gemini response for item ${i + 1}:`, error);
      results.push({ company: "", eventType: "", eventDate: null });
    }
  }

  return results;
}

function determineEventType(categories: string[], geminiSuggestion?: string): string {
  if (geminiSuggestion && EVENT_TYPE_MAPPING[geminiSuggestion as keyof typeof EVENT_TYPE_MAPPING]) {
    return EVENT_TYPE_MAPPING[geminiSuggestion as keyof typeof EVENT_TYPE_MAPPING];
  }

  for (const category of categories) {
    const mappedType = EVENT_TYPE_MAPPING[category as keyof typeof EVENT_TYPE_MAPPING];
    if (mappedType) return mappedType;
  }

  return "Corporate Event";
}

function extractCompanyName(title: string): string {
  const match = title.match(/^([^(]+)/);
  return match ? match[1].trim() : "";
}

function extractDateFromContent(content: string): Date | null {
  try {
    const datePatterns = [
      // Format: February 14, 2025
      /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i,
      // Format: 14th February 2025
      /\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i,
      // Format: 2025-02-14
      /\d{4}-\d{2}-\d{2}/,
    ];

    for (const pattern of datePatterns) {
      const match = content.match(pattern);
      if (match) {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  } catch (error) {
    console.error("Error extracting date:", error);
  }
  return null;
}