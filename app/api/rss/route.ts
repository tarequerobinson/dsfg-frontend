// app/api/rss/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch both RSS feeds
    const [gleanerResponse, observerResponse] = await Promise.all([
      fetch('https://jamaica-gleaner.com/feed/business.xml'),
      fetch('https://www.jamaicaobserver.com/feed')
    ]);

    if (!gleanerResponse.ok || !observerResponse.ok) {
      throw new Error('Failed to fetch news feeds');
    }

    const gleanerData = await gleanerResponse.text();
    const observerData = await observerResponse.text();

    return NextResponse.json({
      gleaner: gleanerData,
      observer: observerData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}