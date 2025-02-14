import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Using a CORS proxy to handle the 403 error
    const jamstockexResponse = await fetch(
      "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.jamstockex.com/feed/"),
    )
    console.log("jamstockexResponse:" , jamstockexResponse)

    if (!jamstockexResponse.ok) {
      throw new Error("Failed to fetch JSE feed")
    }

    const jamstockexData = await jamstockexResponse.text()

    return NextResponse.json({
      jamstockex: jamstockexData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 })
  }
}

