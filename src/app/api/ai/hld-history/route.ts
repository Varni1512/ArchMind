import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HLDHistory from '@/models/HLDHistory';
import { getAuthUser } from '@/lib/auth-check';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const authUser = await getAuthUser(req);
    const userId = authUser ? authUser.id : 'anonymous';

    const { diagramType, ast, elements, previewImage, evaluation, chatHistory } = await req.json();

    if (!diagramType || !ast || !evaluation) {
      return NextResponse.json(
        { message: 'diagramType, ast, and evaluation are required fields.' },
        { status: 400 }
      );
    }

    const historyRecord = await HLDHistory.create({
      userId,
      diagramType,
      ast,
      elements,
      previewImage,
      evaluation,
      chatHistory: chatHistory || [],
    });

    return NextResponse.json(
      { message: 'History saved successfully.', data: historyRecord },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save HLD History Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser(req);
    const query = authUser ? { userId: authUser.id } : { userId: 'anonymous' };
    const histories = await HLDHistory.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: histories }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch HLD History Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
