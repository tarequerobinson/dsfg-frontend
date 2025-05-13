import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Helper function to parse response for structured data
function parseResponse(text) {
  // Check for goal pattern
  if (text.includes("GOAL:") || (text.includes("financial goal") && text.includes("target"))) {
    try {
      // Extract goal information
      const title = text.match(/title[:=]\s*(.*?)(?:\n|$)/i)?.[1]?.trim() || 
                    text.match(/(?:saving|investment|financial) goal[:\s]+(.*?)(?:\n|$)/i)?.[1]?.trim() ||
                    "Financial Goal"
      
      const targetMatch = text.match(/(?:target|amount)[:\s]+\$?([\d,]+)/i)
      const target = targetMatch ? parseInt(targetMatch[1].replace(/,/g, '')) : 100000
      
      const timeframeMatch = text.match(/(?:timeframe|by|within|in)[:\s]+((?:\d+\s+(?:years?|months?)|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}))/i)
      const timeframe = timeframeMatch ? timeframeMatch[1].trim() : "1 year"
      
      const descriptionMatch = text.match(/description[:=]\s*(.*?)(?:\n\n|\n(?=[A-Z])|\n$|$)/is)
      const description = descriptionMatch ? descriptionMatch[1].trim() : undefined
      
      return {
        type: "goal",
        text: text,
        goal: {
          title,
          target,
          timeframe,
          description
        }
      }
    } catch (error) {
      console.error("Error parsing goal data:", error)
    }
  }
  
  // Check for alert pattern
  if (text.includes("ALERT:") || text.includes("market alert") || text.includes("price alert")) {
    try {
      // Extract alert information
      const typeMatch = text.match(/(?:alert type|type)[:=]\s*(price|market|news)/i)
      const type = typeMatch ? typeMatch[1].toLowerCase() : "price"
      
      const targetMatch = text.match(/(?:target|for)[:=]\s*(.*?)(?:\n|when|\s+if)/i)
      const target = targetMatch ? targetMatch[1].trim() : "JSE Index"
      
      const conditionMatch = text.match(/(?:condition|when|if)[:=]\s*(.*?)(?:\n|notify|$)/i)
      const condition = conditionMatch ? conditionMatch[1].trim() : "changes significantly"
      
      const notificationMethodMatch = text.match(/(?:notify via|notification method|send)[:=]\s*(.*?)(?:\n|$)/i)
      const notificationMethodText = notificationMethodMatch ? notificationMethodMatch[1].trim() : "email, push"
      const notificationMethod = notificationMethodText
        .split(/[,\s]+/)
        .filter(method => ["email", "sms", "push", "in-app"].includes(method.toLowerCase()))
      
      return {
        type: "alert",
        text: text,
        alert: {
          type,
          target,
          condition,
          notificationMethod: notificationMethod.length ? notificationMethod : ["email", "push"]
        }
      }
    } catch (error) {
      console.error("Error parsing alert data:", error)
    }
  }
  
  // Default to regular response
  return {
    response: text,
    status: "success"
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      )
    }
    
    const { message, pdfContext } = await req.json()
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Fetch portfolio data
    const token = req.headers.get("Authorization")?.replace("Bearer ", "")
    let portfolioData = { netWorth: 0, assets: [] }
    
    if (token) {
      try {
        const portfolioResponse = await fetch("http://localhost:5000/api/auth/finance", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        })
        
        if (portfolioResponse.ok) {
          portfolioData = await portfolioResponse.json()
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error)
      }
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
    
    let prompt = ""
    if (pdfContext) {
      prompt = `You are a financial analyst assistant specializing in Jamaican finance.
      
      User's Portfolio:
      Net Worth: JMD ${portfolioData.netWorth.toLocaleString()}
      Assets: ${portfolioData.assets?.map(asset => `${asset.name}: ${asset.quantity} shares, Value: JMD ${asset.value.toLocaleString()}`).join(", ") || "No assets"}
      
      Document Context:
      Summary: ${pdfContext.summary}
      Topics: ${pdfContext.topics.join(", ")}
      
      Using both your general knowledge of Jamaican finance, the user's portfolio data, AND the specific context from the document above when relevant, please answer:
      
      ${message}
      
      Remember to:
      1. Use JMD currency when discussing amounts
      2. Reference specific Jamaican financial institutions and markets when applicable
      3. Consider the user's current portfolio, document context, and broader Jamaican financial landscape
      4. Be specific and actionable in your advice
      5. Never give an incomplete response
      6. Never give a black and white answer for any open ended questions because most things are dependent on the variables relevant to the person asking so ask clarifying questions to get a better idea as to how to respond properly. Do not do this excessively as it may annoy the client so please only do this when necessary
      7. There is generally no need to speak patois unless explicitly asked to do so because you are a professional
      
      IMPORTANT: If the user is asking about setting up a financial goal, respond with a structured goal response labeled as "GOAL:" including title, target amount, timeframe, and description.
      
      IMPORTANT: If the user is asking about setting up a market alert, respond with a structured alert response labeled as "ALERT:" including alert type (price, market, or news), target, condition, and notification method (email, sms, push, in-app).
      
      Answer:`
    } else {
      prompt = `You are DSFG's AI Financial Advisor specialized in Jamaican finance.
      
      User's Portfolio:
      Net Worth: JMD ${portfolioData.netWorth.toLocaleString()}
      Assets: ${portfolioData.assets?.map(asset => `${asset.name}: ${asset.quantity} shares, Value: JMD ${asset.value.toLocaleString()}`).join(", ") || "No assets"}
      
      When answering, always:
      1. Focus on the Jamaican financial context
      2. Use JMD currency
      3. Reference specific Jamaican financial institutions, markets, and regulations
      4. Provide actionable advice considering the user's portfolio and local economic environment
      5. Include relevant local market rates, fees, and costs when applicable
      6. Never give an incomplete response
      7. Never give a black and white answer for any open ended questions because most things are dependent on the variables relevant to the person asking so ask clarifying questions to get a better idea as to how to respond properly
      
      IMPORTANT: If the user is asking about setting up a financial goal, respond with a structured goal response labeled as "GOAL:" including title, target amount, timeframe, and description.
      
      IMPORTANT: If the user is asking about setting up a market alert, respond with a structured alert response labeled as "ALERT:" including alert type (price, market, or news), target, condition, and notification method (email, sms, push, in-app).
      
      Question: ${message}
      Answer:`
    }
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    })
    
    const responseText = result.response.text()
    
    // Parse the response for structured data and return the appropriate format
    const parsedResponse = parseResponse(responseText)
    
    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "API is running" }, { status: 200 })
}