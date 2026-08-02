import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth-check';

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';

    await dbConnect();

    const query: any = {};
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('name email role customLimits aiUsage createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { action, userId, customLimits, role } = await req.json();

    if (!action) {
      return NextResponse.json({ message: 'Action is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Reset usage counter
    if (action === 'reset_usage') {
      if (userId === 'all') {
        await User.updateMany({}, {
          $set: {
            'aiUsage.lldReview': 0,
            'aiUsage.lldChat': 0,
            'aiUsage.hldReview': 0,
            'aiUsage.hldChat': 0,
            'aiUsage.aiGenerator': 0,
            'aiUsage.mentorChat': 0,
            'aiUsage.totalCalls': 0,
          }
        });
        return NextResponse.json({ message: 'Reset AI usage for all users successfully.' });
      }

      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }

      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      user.aiUsage = {
        lldReview: 0,
        lldChat: 0,
        hldReview: 0,
        hldChat: 0,
        aiGenerator: 0,
        mentorChat: 0,
        totalCalls: 0,
        lastUsedAt: null,
      };
      await user.save();

      return NextResponse.json({ message: `Reset AI usage for ${user.email} successfully.`, user });
    }

    // 2. Update custom limits
    if (action === 'update_limit') {
      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }

      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      user.customLimits = {
        lldReview: customLimits?.lldReview !== undefined && customLimits?.lldReview !== null && customLimits?.lldReview !== ''
          ? Math.max(0, parseInt(customLimits.lldReview, 10))
          : null,
        lldChat: customLimits?.lldChat !== undefined && customLimits?.lldChat !== null && customLimits?.lldChat !== ''
          ? Math.max(0, parseInt(customLimits.lldChat, 10))
          : null,
        hldReview: customLimits?.hldReview !== undefined && customLimits?.hldReview !== null && customLimits?.hldReview !== ''
          ? Math.max(0, parseInt(customLimits.hldReview, 10))
          : null,
        hldChat: customLimits?.hldChat !== undefined && customLimits?.hldChat !== null && customLimits?.hldChat !== ''
          ? Math.max(0, parseInt(customLimits.hldChat, 10))
          : null,
        aiGenerator: customLimits?.aiGenerator !== undefined && customLimits?.aiGenerator !== null && customLimits?.aiGenerator !== ''
          ? Math.max(0, parseInt(customLimits.aiGenerator, 10))
          : null,
        mentorChat: customLimits?.mentorChat !== undefined && customLimits?.mentorChat !== null && customLimits?.mentorChat !== ''
          ? Math.max(0, parseInt(customLimits.mentorChat, 10))
          : null,
      };

      await user.save();
      return NextResponse.json({ message: `Custom limits updated for ${user.email}`, user });
    }

    // 3. Change role
    if (action === 'change_role') {
      if (!userId || !role || !['user', 'admin'].includes(role)) {
        return NextResponse.json({ message: 'Valid userId and role are required' }, { status: 400 });
      }

      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      user.role = role;
      await user.save();

      return NextResponse.json({ message: `Role changed to ${role} for ${user.email}`, user });
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
