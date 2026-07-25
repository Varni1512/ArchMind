import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')
      ?.split('; ')
      ?.find((c) => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }
}
