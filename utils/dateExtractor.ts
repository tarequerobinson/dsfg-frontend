import { parse, isValid, isFuture } from "date-fns"

export function extractDatesFromText(text: string): Date[] {
  // Regular expressions for various date formats
  const datePatterns = [
    /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b/gi,
    /\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/g,
    /\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/g,
  ]

  const extractedDates: Date[] = []

  datePatterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      let date: Date | undefined

      if (match[0].includes("/") || match[0].includes("-")) {
        // For DD/MM/YYYY or YYYY-MM-DD formats
        date = parse(match[0], "dd/MM/yyyy", new Date())
        if (!isValid(date)) {
          date = parse(match[0], "yyyy-MM-dd", new Date())
        }
      } else {
        // For month name formats
        const monthNames = [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ]
        const month = monthNames.indexOf(match[1].toLowerCase())
        const day = Number.parseInt(match[2])
        const year = Number.parseInt(match[3])
        date = new Date(year, month, day)
      }

      if (isValid(date) && isFuture(date)) {
        extractedDates.push(date)
      }
    }
  })

  return extractedDates
}

export function extractEventDetails(text: string): { eventType: string; company: string } {
  const eventTypes = [
    "AGM",
    "Board Meeting",
    "Earnings",
    "Stock Split",
    "Rights Issue",
    "IPO",
    "Dividend",
    "Merger",
    "Acquisition",
    "Financial Results",
  ]

  let eventType = "Corporate Event"
  let company = ""

  // Extract event type
  for (const type of eventTypes) {
    if (text.toLowerCase().includes(type.toLowerCase())) {
      eventType = type
      break
    }
  }

  // Extract company name (assuming it's mentioned at the beginning of the text)
  const companyMatch = text.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)*)/)
  if (companyMatch) {
    company = companyMatch[0].trim()
  }

  return { eventType, company }
}

