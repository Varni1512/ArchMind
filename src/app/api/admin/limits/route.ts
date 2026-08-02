import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SystemSetting, { DEFAULT_AI_LIMITS } from '@/models/SystemSetting';
import { requireAdmin } from '@/lib/auth-check';

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    await dbConnect();
    const setting = await SystemSetting.findOne({ key: 'global_ai_limits' });
    return NextResponse.json({
      limits: setting?.limits || DEFAULT_AI_LIMITS,
      defaultLimits: DEFAULT_AI_LIMITS,
      updatedAt: setting?.updatedAt || null,
      updatedBy: setting?.updatedBy || 'system',
    }, { status: 200 });
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

    const { limits } = await req.json();

    if (!limits || typeof limits !== 'object') {
      return NextResponse.json({ message: 'Invalid limits object' }, { status: 400 });
    }

    // Validate limit numbers (must be >= 0)
    const validLimits = {
      lldReview: Math.max(0, parseInt(limits.lldReview, 10) || DEFAULT_AI_LIMITS.lldReview),
      lldChat: Math.max(0, parseInt(limits.lldChat, 10) || DEFAULT_AI_LIMITS.lldChat),
      hldReview: Math.max(0, parseInt(limits.hldReview, 10) || DEFAULT_AI_LIMITS.hldReview),
      hldChat: Math.max(0, parseInt(limits.hldChat, 10) || DEFAULT_AI_LIMITS.hldChat),
      aiGenerator: Math.max(0, parseInt(limits.aiGenerator, 10) || DEFAULT_AI_LIMITS.aiGenerator),
      mentorChat: Math.max(0, parseInt(limits.mentorChat, 10) || DEFAULT_AI_LIMITS.mentorChat),
    };

    await dbConnect();

    const updatedSetting = await SystemSetting.findOneAndUpdate(
      { key: 'global_ai_limits' },
      {
        limits: validLimits,
        updatedBy: admin.email,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Global AI limits updated successfully',
      limits: updatedSetting.limits,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
