import { NextResponse } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/GroqProvider';
import { getHLDTerraformPrompt } from '@/services/ai/prompts/HLDTerraformPrompt';
import { checkAuth } from '@/lib/auth-check';

export async function POST(req: Request) {
  try {
    const isAuthenticated = await checkAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { ast } = await req.json();

    if (!ast) {
      return NextResponse.json(
        { message: 'AST data is required.' },
        { status: 400 }
      );
    }

    const aiProvider = new GroqProvider();
    const systemPrompt = getHLDTerraformPrompt(JSON.stringify(ast, null, 2));

    let response = await aiProvider.generateResponse(
      [{ role: 'system', content: systemPrompt }],
      'llama-3.3-70b-versatile',
      0.1
    );

    // Clean up markdown block wrappers if present
    response = response.replace(/^\s*```[a-zA-Z]*\s*\n/gm, '').replace(/^\s*```\s*$/gm, '').trim();

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: any) {
    console.error('Terraform Code Gen Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
