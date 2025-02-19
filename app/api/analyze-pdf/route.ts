import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const base64Data = Buffer.from(bytes).toString("base64")

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      `Analyze this financial document focusing on Jamaican financial context. Generate:
      
      1. A boolean "isFinanceRelated" indicating if it contains relevant financial content
      2. Main financial "topics" present (list up to 5 key topics)
      3. A "confidence" score between 0-1
      4. A detailed "reason" explaining:
         - Key financial information found
         - Specific topics that can be analyzed
         - Types of questions that can be answered
         - Any Jamaican-specific financial context
      
      Format the response as valid JSON without any code block formatting. Example structure:
      {
        "isFinanceRelated": true,
        "topics": ["topic1", "topic2"],
        "confidence": 0.95,
        "reason": "This document contains... You can ask about..."
      }`
    ])

    const analysisText = await result.response.text()
    
    let analysis
    try {
      const cleanedText = analysisText.replace(/```json\n|\n```/g, "").trim()
      analysis = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Error parsing JSON:", e)
      analysis = {
        isFinanceRelated: false,
        topics: [],
        confidence: 0,
        reason: "Unable to analyze document content. Please ensure it contains financial information.",
      }
    }

    return NextResponse.json({
      status: "success",
      analysis,
      documentId: file.name,
    })
  } catch (error) {
    console.error("Error in PDF analysis API:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "PDF Analysis API is running" },
    { status: 200 }
  )
}