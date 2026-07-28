import { NextResponse } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/GroqProvider';

export async function POST(req: Request) {
  try {
    const { ast, diagramType } = await req.json();

    if (!ast) {
      return NextResponse.json(
        { message: 'AST data is required.' },
        { status: 400 }
      );
    }

    // Instantiate the abstract provider (currently Groq)
    const aiProvider = new GroqProvider();

    // Call evaluateDesign on the provider
    const evaluation = await aiProvider.evaluateDesign(ast, diagramType || 'Unknown Diagram');

    return NextResponse.json(
      { message: 'Evaluation successful', data: evaluation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('AI Evaluation Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
