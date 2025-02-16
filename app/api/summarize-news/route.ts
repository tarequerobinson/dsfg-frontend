// app/api/summarize-news/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const SUMMARY_CACHE = new Map()

export async function POST(req: Request) {
  try {
    const { articles } = await req.json()
    
    // Create a cache key based on article contents
    const cacheKey = articles.map(a => a.title + a.description).join('|')
    
    // Return cached response if available
    if (SUMMARY_CACHE.has(cacheKey)) {
      return NextResponse.json({ summary: SUMMARY_CACHE.get(cacheKey) })
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500
      }
    })

    const prompt = `
    You are a Jamaica-based, polite personal financial analyst assistant. Your task is to summarize the latest Jamaican business news in one concise paragraph. Use a personal and direct tone by addressing clients as "you" and "we." Provide valuable insights without asking questions, and keep your summary brief to respect your client’s time. Highlight impactful information within your financial expertise that could influence their personal finances. If no relevant news is found, inform them that the current business updates do not impact their financial goals. Additionally, analyze how any news might directly or indirectly affect companies listed on the Jamaica Stock Exchange (JSE), whether positively or negatively. Format your response in markdown.
    
    Analyze these Jamaican business articles, highlight key trends and takeaways, and assess potential impacts on your client’s financial well-being:
    ${articles.slice(0, 50).map(a => a.title).join(", ")}
    `;
    
    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    // Cache the response for 1 hour
    SUMMARY_CACHE.set(cacheKey, response)
    setTimeout(() => SUMMARY_CACHE.delete(cacheKey), 3600000)

    return NextResponse.json({ summary: response })
  } catch (error) {
    console.error("Summary error:", error)
    return NextResponse.json(
      { error: "Summary service is currently busy. Please try again later." },
      { status: 503 }
    )
  }
}