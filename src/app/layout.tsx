import type { Metadata } from "next";
import { Caveat } from 'next/font/google';
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ArchMind — AI System Design Copilot",
  description: "ArchMind — AI System Design Copilot",
};

import NextAuthProvider from "@/components/providers/NextAuthProvider";

// ... existing imports ...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${caveat.variable}`}>
        <NextAuthProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
