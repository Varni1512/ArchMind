import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import { MentorChat } from '@/models/MentorChat';

// PUT update a chat (title, messages, etc)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('cookie')
      ?.split('; ')
      ?.find((c) => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    const body = await req.json();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();

    // Make sure we only update if it belongs to the user
    const updatedChat = await MentorChat.findOneAndUpdate(
      { id, user: decoded.id },
      { $set: body },
      { new: true }
    );

    if (!updatedChat) {
      return NextResponse.json({ message: 'Chat not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ chat: updatedChat }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating chat', error: error.message }, { status: 500 });
  }
}

// DELETE a chat
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('cookie')
      ?.split('; ')
      ?.find((c) => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();

    const deletedChat = await MentorChat.findOneAndDelete({ id, user: decoded.id });

    if (!deletedChat) {
      return NextResponse.json({ message: 'Chat not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting chat', error: error.message }, { status: 500 });
  }
}
