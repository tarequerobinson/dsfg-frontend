// app/api/article/route.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
    });

    if (response.status === 403 || response.status === 429) {
      return NextResponse.json(
        { error: 'Access temporarily restricted by the news website. Please try again in a few minutes.' },
        { status: 429 }
      );
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    let content = '';
    if (url.includes('jamaica-gleaner.com')) {
        content = $('.article-content').html() || '';

    } else if (url.includes('jamaicaobserver.com')) {

        content = $('.body.content-single-wrap.multiline').html() || '';

    }
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Unable to extract article content. The website structure might have changed.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article content. Please try again later.' },
      { status: 500 }
    );
  }
}