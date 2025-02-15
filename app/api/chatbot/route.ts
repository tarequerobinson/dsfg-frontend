import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    const { message, pdfContext, isPdfAnalyzed } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }

    let prompt = ""

    if (isPdfAnalyzed && pdfContext) {
      prompt = `You are a financial analyst assistant. Use this document context to answer questions:
      Document Summary: ${pdfContext.summary}
      Key Topics: ${pdfContext.topics.join(", ")}
      
      Question: ${message}
      Answer:`
    } else {
      prompt = `You are DSFG's AI Financial Advisor specialized in Jamaican finance. 
      Provide advice focused on Jamaican financial context using JMD currency.
      Question: ${message}
      Answer:`
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    })

    const response = await result.response.text()

    return NextResponse.json({
      response,
      status: "success",
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "API is running" }, { status: 200 })
}

