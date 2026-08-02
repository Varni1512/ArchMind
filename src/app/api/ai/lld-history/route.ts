import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LLDHistory from '@/models/LLDHistory';
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

    const historyRecord = await LLDHistory.create({
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
    console.error('Save LLD History Error:', error);
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
    const histories = await LLDHistory.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: histories }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch LLD History Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

