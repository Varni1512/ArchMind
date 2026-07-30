import { NextResponse } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/GroqProvider';
import { getHLDReviewPrompt } from '@/services/ai/prompts/HLDReviewPrompt';
import { checkAuth } from '@/lib/auth-check';

export async function POST(req: Request) {
  try {
    const isAuthenticated = await checkAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { ast, diagramType } = await req.json();

    if (!ast) {
      return NextResponse.json(
        { message: 'AST data is required.' },
        { status: 400 }
      );
    }

    const aiProvider = new GroqProvider();
    
    // Pass the custom HLD prompt to the provider
    const systemPrompt = getHLDReviewPrompt(diagramType || 'System Architecture');
    const evaluation = await aiProvider.evaluateDesign(ast, diagramType || 'System Architecture', systemPrompt);

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
