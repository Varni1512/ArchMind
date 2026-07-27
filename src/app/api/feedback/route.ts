import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { rating, comment } = body;
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid rating between 1 and 5 is required' }, { status: 400 });
    }
    
    const feedback = await Feedback.create({
      rating,
      comment: comment || '',
    });
    
    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
