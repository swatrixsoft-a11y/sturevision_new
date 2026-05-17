import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sturevision - Study Once. Revise Smart.",
    template: "%s | Sturevision",
  },
  description:
    "India's #1 AI-powered revision platform for CBSE students. Generate quizzes, flashcards, and smart revision schedules from your notes.",
  keywords: ["CBSE revision", "AI study app", "flashcards India", "MCQ generator", "spaced repetition"],
  authors: [{ name: "Sturevision" }],
  openGraph: {
    title: "Sturevision - Study Once. Revise Smart.",
    description: "AI-powered revision platform for CBSE students",
    type: "website",
    locale: "en_IN",
  },
  icons: { icon: "/favicon.ico" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
