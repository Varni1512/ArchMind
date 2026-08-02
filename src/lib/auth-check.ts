import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export interface AuthUserInfo {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

export async function getAuthUser(req: Request): Promise<AuthUserInfo | null> {
  try {
    // 1. Check Custom JWT Token from cookie
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const token = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
          if (decoded && decoded.id) {
            // Check if role is in token, or fetch user from DB if missing
            if (decoded.role) {
              return {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role || 'user',
              };
            }
            await dbConnect();
            const dbUser = await User.findById(decoded.id).select('name email role');
            if (dbUser) {
              return {
                id: dbUser._id.toString(),
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role || 'user',
              };
            }
          }
        } catch (jwtError) {
          // Token is invalid or expired
        }
      }
    }

    // 2. Check NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email }).select('name email role');
      if (dbUser) {
        return {
          id: dbUser._id.toString(),
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role || 'user',
        };
      }
      return {
        id: (session.user as any).id || session.user.email,
        email: session.user.email,
        name: session.user.name || undefined,
        role: 'user',
      };
    }

    return null;
  } catch (error) {
    console.error("getAuthUser failed:", error);
    return null;
  }
}

export async function checkAuth(req: Request): Promise<boolean> {
  const user = await getAuthUser(req);
  return !!user;
}

export async function requireAdmin(req: Request): Promise<AuthUserInfo | null> {
  const user = await getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user;
}
