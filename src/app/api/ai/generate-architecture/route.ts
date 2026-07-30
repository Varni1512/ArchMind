import { NextResponse } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/GroqProvider';
import { checkAuth } from '@/lib/auth-check';

export async function POST(req: Request) {
  try {
    const isAuthenticated = await checkAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, complexity, cloudProvider } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const provider = new GroqProvider();

    if (!provider.generateArchitecture) {
      return NextResponse.json({ error: 'Provider does not support architecture generation' }, { status: 501 });
    }

    const architecture = await provider.generateArchitecture(prompt, complexity, cloudProvider);

    return NextResponse.json(architecture);
  } catch (error: any) {
    console.error('Error generating architecture:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate architecture' },
      { status: 500 }
    );
  }
}
