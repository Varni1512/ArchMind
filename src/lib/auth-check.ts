import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function checkAuth(req: Request): Promise<boolean> {
  try {
    // 1. Check NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return true; // Authenticated via NextAuth
    }

    // 2. Check Custom JWT Token
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET || "secret");
          return true; // Authenticated via custom JWT
        } catch (jwtError) {
          // Token is invalid or expired
        }
      }
    }

    return false; // Not authenticated
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}
