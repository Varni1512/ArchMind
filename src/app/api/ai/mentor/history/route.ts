import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import { MentorChat } from '@/models/MentorChat';

// GET all chats for the logged in user
export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')
      ?.split('; ')
      ?.find((c) => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    await dbConnect();
    
    // Sort by updated at descending
    const chats = await MentorChat.find({ user: decoded.id }).sort({ updatedAt: -1 }).lean();

    // Map _id and cleanup
    const formattedChats = chats.map((chat: any) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messages: chat.messages,
      pinned: chat.pinned,
      mode: chat.mode
    }));

    return NextResponse.json({ chats: formattedChats }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching history', error: error.message }, { status: 500 });
  }
}

// POST create a new chat
export async function POST(req: Request) {
  try {
    const token = req.headers.get('cookie')
      ?.split('; ')
      ?.find((c) => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    const body = await req.json();

    await dbConnect();

    const newChat = new MentorChat({
      ...body,
      user: decoded.id
    });

    await newChat.save();

    return NextResponse.json({ chat: newChat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating chat', error: error.message }, { status: 500 });
  }
}
