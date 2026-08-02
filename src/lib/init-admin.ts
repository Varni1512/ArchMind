import bcrypt from 'bcryptjs';
import User from '@/models/User';
import SystemSetting, { DEFAULT_AI_LIMITS } from '@/models/SystemSetting';

let isInitialized = false;

export async function initAdminAndSettings() {
  if (isInitialized) return;

  try {
    // 1. Seed / Ensure Admin User
    const adminEmail = 'admin@gmail.com';
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        aiUsage: {
          lldReview: 0,
          lldChat: 0,
          hldReview: 0,
          hldChat: 0,
          aiGenerator: 0,
          mentorChat: 0,
          totalCalls: 0,
        },
      });
      console.log('✅ Admin user created: admin@gmail.com / admin123');
    } else {
      let needsSave = false;
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        needsSave = true;
      }
      if (!adminUser.password) {
        adminUser.password = await bcrypt.hash('admin123', 10);
        needsSave = true;
      }
      if (needsSave) {
        await adminUser.save();
        console.log('✅ Admin user updated with admin role and credentials.');
      }
    }

    // 2. Seed / Ensure Default System Setting
    const existingSetting = await SystemSetting.findOne({ key: 'global_ai_limits' });
    if (!existingSetting) {
      await SystemSetting.create({
        key: 'global_ai_limits',
        limits: { ...DEFAULT_AI_LIMITS },
        updatedBy: 'system_init',
      });
      console.log('✅ Global AI limits initialized with defaults:', DEFAULT_AI_LIMITS);
    } else if (!existingSetting.limits || typeof existingSetting.limits.aiGenerator !== 'number') {
      existingSetting.limits = {
        lldReview: existingSetting.limits?.lldReview ?? DEFAULT_AI_LIMITS.lldReview,
        lldChat: existingSetting.limits?.lldChat ?? DEFAULT_AI_LIMITS.lldChat,
        hldReview: existingSetting.limits?.hldReview ?? DEFAULT_AI_LIMITS.hldReview,
        hldChat: existingSetting.limits?.hldChat ?? DEFAULT_AI_LIMITS.hldChat,
        aiGenerator: existingSetting.limits?.aiGenerator ?? DEFAULT_AI_LIMITS.aiGenerator,
        mentorChat: existingSetting.limits?.mentorChat ?? DEFAULT_AI_LIMITS.mentorChat,
      };
      await existingSetting.save();
    }

    isInitialized = true;
  } catch (error) {
    console.error('Error in initAdminAndSettings:', error);
  }
}
