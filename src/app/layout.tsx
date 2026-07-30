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
  metadataBase: new URL('https://archmind.codewithvarni.app'),
  title: {
    default: "ArchMind — AI System Design Copilot",
    template: "%s | ArchMind",
  },
  description: "Your AI-powered copilot for generating, analyzing, and reviewing high-level and low-level system architectures in seconds.",
  keywords: ["System Design", "AI Architecture", "HLD", "LLD", "Software Architecture", "UML Generator", "System Design Interview"],
  openGraph: {
    title: "ArchMind — AI System Design Copilot",
    description: "Generate, analyze, and review system architectures with AI.",
    url: "https://archmind.codewithvarni.app",
    siteName: "ArchMind",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "ArchMind Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchMind — AI System Design Copilot",
    description: "Generate, analyze, and review system architectures with AI.",
    images: ["/logo.svg"],
  },
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
