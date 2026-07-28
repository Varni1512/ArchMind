import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LLDHistory from '@/models/LLDHistory';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { diagramType, ast, elements, evaluation, chatHistory } = await req.json();

    if (!diagramType || !ast || !evaluation) {
      return NextResponse.json(
        { message: 'diagramType, ast, and evaluation are required fields.' },
        { status: 400 }
      );
    }

    const historyRecord = await LLDHistory.create({
      diagramType,
      ast,
      elements,
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

export async function GET() {
  try {
    await dbConnect();
    // Fetch all history records, sorted by newest first
    const histories = await LLDHistory.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: histories }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch LLD History Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

