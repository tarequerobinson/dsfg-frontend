import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
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
      "Analyze this financial document and generate: " +
        '- A boolean "isFinanceRelated" indicating if it contains financial content\n' +
        '- Main financial "topics" present\n' +
        '- A "confidence" score between 0-1\n' +
        '- A "reason" explaining the analysis and listing specific question types ' +
        "that can be answered based on the document content. " +
        'Format example: "This document contains [X], [Y], [Z]. You can ask about...". ' +
        "Respond only with valid JSON without any code block formatting.",
    ])

    const analysisText = await result.response.text()
    console.log("Analysis Text:", analysisText)

    let analysis
    try {
      // Remove any potential code block formatting
      const cleanedText = analysisText.replace(/```json\n|\n```/g, "").trim()
      analysis = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Error parsing JSON:", e)
      analysis = {
        isFinanceRelated: false,
        topics: [],
        confidence: 0,
        reason: "Unable to parse document analysis",
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
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "PDF Analysis API is running" }, { status: 200 })
}

