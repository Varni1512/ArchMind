import dbConnect from '@/lib/db';
import User from '@/models/User';
import SystemSetting, { DEFAULT_AI_LIMITS, IAILimits } from '@/models/SystemSetting';
import { getAuthUser, AuthUserInfo } from '@/lib/auth-check';

export type AIFeatureKey = 'lldReview' | 'lldChat' | 'hldReview' | 'hldChat' | 'aiGenerator' | 'mentorChat';

export const FEATURE_NAMES: Record<AIFeatureKey, string> = {
  lldReview: 'LLD Design Review',
  lldChat: 'LLD Assistant Chat',
  hldReview: 'HLD Design Review',
  hldChat: 'HLD Assistant Chat',
  aiGenerator: 'AI Architecture Generator',
  mentorChat: 'AI Mentor Chat',
};

export async function getGlobalLimits(): Promise<IAILimits> {
  await dbConnect();
  const setting = await SystemSetting.findOne({ key: 'global_ai_limits' });
  if (setting && setting.limits) {
    return {
      lldReview: setting.limits.lldReview ?? DEFAULT_AI_LIMITS.lldReview,
      lldChat: setting.limits.lldChat ?? DEFAULT_AI_LIMITS.lldChat,
      hldReview: setting.limits.hldReview ?? DEFAULT_AI_LIMITS.hldReview,
      hldChat: setting.limits.hldChat ?? DEFAULT_AI_LIMITS.hldChat,
      aiGenerator: setting.limits.aiGenerator ?? DEFAULT_AI_LIMITS.aiGenerator,
      mentorChat: setting.limits.mentorChat ?? DEFAULT_AI_LIMITS.mentorChat,
    };
  }
  return { ...DEFAULT_AI_LIMITS };
}

export interface QuotaCheckResult {
  success: boolean;
  status?: number;
  message?: string;
  current?: number;
  max?: number;
  remaining?: number;
  isAdmin?: boolean;
  user?: AuthUserInfo;
}

export async function checkAndIncrementQuota(
  req: Request,
  feature: AIFeatureKey
): Promise<QuotaCheckResult> {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return {
      success: false,
      status: 401,
      message: 'Unauthorized. Please sign in to use this AI feature.',
    };
  }

  await dbConnect();
  const dbUser = await User.findById(authUser.id);
  if (!dbUser) {
    return {
      success: false,
      status: 404,
      message: 'User account not found.',
    };
  }

  // Admin users have unlimited access
  if (dbUser.role === 'admin') {
    // Record usage without blocking
    if (!dbUser.aiUsage) dbUser.aiUsage = {};
    dbUser.aiUsage[feature] = (dbUser.aiUsage[feature] || 0) + 1;
    dbUser.aiUsage.totalCalls = (dbUser.aiUsage.totalCalls || 0) + 1;
    dbUser.aiUsage.lastUsedAt = new Date();
    await dbUser.save();

    return {
      success: true,
      isAdmin: true,
      current: dbUser.aiUsage[feature],
      max: 9999,
      remaining: 9999,
      user: authUser,
    };
  }

  // Retrieve global limits and user custom limit overrides
  const globalLimits = await getGlobalLimits();
  const customLimit = dbUser.customLimits?.[feature];
  const maxLimit = typeof customLimit === 'number' && customLimit >= 0
    ? customLimit
    : globalLimits[feature];

  if (!dbUser.aiUsage) {
    dbUser.aiUsage = {
      lldReview: 0,
      lldChat: 0,
      hldReview: 0,
      hldChat: 0,
      aiGenerator: 0,
      mentorChat: 0,
      totalCalls: 0,
    };
  }

  const currentUsage = dbUser.aiUsage[feature] || 0;

  if (currentUsage >= maxLimit) {
    return {
      success: false,
      status: 403,
      message: `Usage limit exceeded for ${FEATURE_NAMES[feature]} (${currentUsage}/${maxLimit} used). You can ask the Admin to increase your limit!`,
      current: currentUsage,
      max: maxLimit,
      remaining: 0,
      user: authUser,
    };
  }

  // Increment usage
  dbUser.aiUsage[feature] = currentUsage + 1;
  dbUser.aiUsage.totalCalls = (dbUser.aiUsage.totalCalls || 0) + 1;
  dbUser.aiUsage.lastUsedAt = new Date();
  await dbUser.save();

  const newUsage = currentUsage + 1;
  return {
    success: true,
    current: newUsage,
    max: maxLimit,
    remaining: Math.max(0, maxLimit - newUsage),
    user: authUser,
  };
}

export async function getUserQuotaSummary(userId: string) {
  await dbConnect();
  const dbUser = await User.findById(userId);
  if (!dbUser) return null;

  const globalLimits = await getGlobalLimits();
  const features: AIFeatureKey[] = ['lldReview', 'lldChat', 'hldReview', 'hldChat', 'aiGenerator', 'mentorChat'];

  const summary: Record<string, { used: number; max: number; remaining: number; name: string }> = {};

  for (const feature of features) {
    const customLimit = dbUser.customLimits?.[feature];
    const maxLimit = typeof customLimit === 'number' && customLimit >= 0
      ? customLimit
      : globalLimits[feature];
    const used = dbUser.aiUsage?.[feature] || 0;

    summary[feature] = {
      name: FEATURE_NAMES[feature],
      used,
      max: dbUser.role === 'admin' ? 9999 : maxLimit,
      remaining: dbUser.role === 'admin' ? 9999 : Math.max(0, maxLimit - used),
    };
  }

  return {
    role: dbUser.role || 'user',
    totalCalls: dbUser.aiUsage?.totalCalls || 0,
    features: summary,
  };
}
