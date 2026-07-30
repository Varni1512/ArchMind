import { NextResponse } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/GroqProvider';
import { checkAuth } from '@/lib/auth-check';

export async function POST(req: Request) {
  try {
    const isAuthenticated = await checkAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { messages, ast, diagramType } = await req.json();

    if (!ast || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { message: 'AST data and messages array are required.' },
        { status: 400 }
      );
    }

    const aiProvider = new GroqProvider();
    const reply = await aiProvider.chatWithDesign(messages, ast, diagramType || 'Unknown Diagram');

    return NextResponse.json(
      { message: 'Chat successful', data: reply },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
