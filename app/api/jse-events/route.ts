import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"

// Type definitions for RSS feed items
interface RssItem {
  title: string
  link: string
  pubDate: string
  description: string
  category: string | string[]
}

interface ExtractedEvent {
  title: string
  link: string
  pubDate: string
  description: string
  eventType: string
  company: string
  eventDate: Date | null
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Event type mapping based on RSS categories and content
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
}

export async function GET() {
  try {
    // Fetch JSE RSS feed
    const jamstockexResponse = await fetch(
      "https://api.allorigins.win/raw?url=" + 
      encodeURIComponent("https://www.jamstockex.com/feed/")
    )

    if (!jamstockexResponse.ok) {
      throw new Error("Failed to fetch JSE feed")
    }

    const xmlData = await jamstockexResponse.text()
    
    // Parse the XML using fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
    })
    
    const jsonObj = parser.parse(xmlData)
    const rssItems = jsonObj.rss.channel.item

    const events = await parseAndCategorizeEvents(rssItems)

    return NextResponse.json({
      jamstockex: xmlData,
      events: events
    })
  } catch (error) {
    console.error("Error in JSE events API:", error)
    return NextResponse.json(
      { error: "Failed to fetch and process RSS feeds", details: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    )
  }
}

async function parseAndCategorizeEvents(items: RssItem[]): Promise<ExtractedEvent[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  const extractedEvents: ExtractedEvent[] = []

  for (const item of items) {
    // Ensure category is always an array
    const categories = Array.isArray(item.category) ? item.category : [item.category || ""]

    // Use Gemini to analyze the content and extract event details
    const prompt = `
      Analyze this JSE announcement and extract the following information:
      1. Company name
      2. Event type (AGM, Board Meeting, Earnings, Stock Split, Rights Issue, IPO, Dividend, Merger, Acquisition, or Corporate Event)
      3. Event date (if mentioned)
      4. Any specific details about the event

      Title: ${item.title}
      Description: ${item.description}
      Categories: ${categories.join(", ")}
    `

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      })

      const analysis = await result.response.text()
      
      // Parse the Gemini response to extract structured data
      const eventDetails = parseGeminiResponse(analysis)
      
      extractedEvents.push({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        eventType: determineEventType(categories, eventDetails.eventType),
        company: eventDetails.company || extractCompanyName(item.title),
        eventDate: eventDetails.eventDate || extractDateFromContent(item.description)
      })
    } catch (error) {
      console.error("Error analyzing event with Gemini:", error)
      // Fall back to basic category-based classification
      extractedEvents.push({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        eventType: determineEventType(categories),
        company: extractCompanyName(item.title),
        eventDate: extractDateFromContent(item.description)
      })
    }
  }

  return extractedEvents
}

function determineEventType(
  categories: string[], 
  geminiSuggestion?: string
): string {
  // First check Gemini's suggestion if available
  if (geminiSuggestion && EVENT_TYPE_MAPPING[geminiSuggestion as keyof typeof EVENT_TYPE_MAPPING]) {
    return EVENT_TYPE_MAPPING[geminiSuggestion as keyof typeof EVENT_TYPE_MAPPING]
  }

  // Fall back to category-based mapping
  for (const category of categories) {
    const mappedType = EVENT_TYPE_MAPPING[category as keyof typeof EVENT_TYPE_MAPPING]
    if (mappedType) return mappedType
  }

  return "Corporate Event"
}

function parseGeminiResponse(response: string): {
  company: string
  eventType: string
  eventDate: Date | null
} {
  try {
    // Extract company name (typically in parentheses with ticker)
    const companyMatch = response.match(/Company name:?\s*([^(]+?)(?:\s*\([A-Z]+\))?\s*(?:\n|$)/i)
    const company = companyMatch ? companyMatch[1].trim() : ""

    // Extract event type
    const eventTypeMatch = response.match(/Event type:?\s*([^,\n]+)/i)
    const eventType = eventTypeMatch ? eventTypeMatch[1].trim() : ""

    // Extract date
    const dateMatch = response.match(/Event date:?\s*([^,\n]+)/i)
    const eventDate = dateMatch ? new Date(dateMatch[1]) : null

    return {
      company,
      eventType,
      eventDate: !isNaN(eventDate?.getTime() || 0) ? eventDate : null
    }
  } catch (error) {
    console.error("Error parsing Gemini response:", error)
    return {
      company: "",
      eventType: "",
      eventDate: null
    }
  }
}

function extractCompanyName(title: string): string {
  // Extract company name from title (e.g., "Company Name (TICKER)")
  const match = title.match(/^([^(]+)/)
  return match ? match[1].trim() : ""
}

function extractDateFromContent(content: string): Date | null {
  try {
    // Look for common date patterns
    const datePatterns = [
      // Format: February 14, 2025
      /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i,
      // Format: 14th February 2025
      /\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i,
      // Format: 2025-02-14
      /\d{4}-\d{2}-\d{2}/,
    ]

    for (const pattern of datePatterns) {
      const match = content.match(pattern)
      if (match) {
        const date = new Date(match[0])
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }
  } catch (error) {
    console.error("Error extracting date:", error)
  }
  
  return null
}