import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArchMind — AI System Design Copilot",
  description: "ArchMind — AI System Design Copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
