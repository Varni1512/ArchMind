import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key not found' }, { status: 500 });
    }

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
    });

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: 'You are a title generator. Given a user prompt, generate a short, concise, and professional title (max 5 words) summarizing it. Do not include quotes or punctuation at the end.',
      prompt: message,
      temperature: 0.3,
    });

    return NextResponse.json({ title: text.trim().replace(/^["']|["']$/g, '') });
  } catch (error: any) {
    console.error('Mentor Title API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate title' },
      { status: 500 }
    );
  }
}
