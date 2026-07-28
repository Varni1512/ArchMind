import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, hasImages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key not found' }, { status: 500 });
    }

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
      compatibility: 'compatible'
    });

    // Use llama-3.2-90b-vision-preview if there are images, otherwise standard Llama 3.3 70b
    const modelName = hasImages ? 'llama-3.2-90b-vision-preview' : 'llama-3.3-70b-versatile';

    const systemMessages = messages.filter((m: any) => m.role === 'system').map((m: any) => m.content).join('\n\n');
    const userAndAssistantMessages = messages.filter((m: any) => m.role !== 'system');

    const result = await streamText({
      model: groq.chat(modelName),
      messages: userAndAssistantMessages,
      system: systemMessages || undefined,
      temperature: 0.7
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Mentor Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat' },
      { status: 500 }
    );
  }
}
