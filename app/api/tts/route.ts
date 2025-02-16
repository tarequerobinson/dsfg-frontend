import { ElevenLabsClient } from "elevenlabs";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid text string is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log('Initializing ElevenLabs client...');
    const client = new ElevenLabsClient({
      apiKey: apiKey,
    });

    console.log('Starting text-to-speech conversion with text:', text.substring(0, 50) + '...');

    // Get the audio stream using the generate method
    const audioStream = await client.generate({
      voice: "Rachel",
      model_id: "eleven_turbo_v2_5",
      text,
    });

    // Collect all chunks into a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    // Combine all chunks into a single buffer
    const audioContent = Buffer.concat(chunks);

    // Return the audio content with proper headers
    return new Response(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioContent.length.toString(),
      },
    });

  } catch (error) {
    console.error('TTS Error:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate audio',
        details: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}