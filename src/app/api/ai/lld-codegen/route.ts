import { NextResponse } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/GroqProvider';
import { getLLDCodeGenPrompt } from '@/services/ai/prompts/LLDCodeGenPrompt';

export async function POST(req: Request) {
  try {
    const { ast, diagramType, language } = await req.json();

    if (!ast || !diagramType || !language) {
      return NextResponse.json(
        { message: 'AST, diagramType, and language are required fields.' },
        { status: 400 }
      );
    }

    const aiProvider = new GroqProvider();
    
    // We construct a specific system prompt for code generation
    const systemPrompt = getLLDCodeGenPrompt(language, diagramType, JSON.stringify(ast, null, 2));

    // Call the AI model
    // GroqProvider's generateResponse takes a list of messages
    let response = await aiProvider.generateResponse(
      [{ role: 'system', content: systemPrompt }],
      'llama-3.3-70b-versatile',
      0.2 // Lower temperature for more deterministic code generation
    );

    // Strip out markdown code blocks if the AI ignored the prompt instruction
    response = response.replace(/^\s*```[a-zA-Z]*\s*\n/gm, '').replace(/^\s*```\s*$/gm, '').trim();

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: any) {
    console.error('LLD Code Gen Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
