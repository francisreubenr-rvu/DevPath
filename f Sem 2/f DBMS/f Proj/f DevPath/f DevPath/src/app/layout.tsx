import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevPath - Project-Driven Programming Learning Platform",
  description: "Learn by Building. Ship Something Real. DevPath is an AI-augmented, project-driven learning platform that unifies structured programming education with professional product development.",
  keywords: ["DevPath", "Programming", "Learning", "Web Development", "AI Learning", "Project-Based Learning", "Code Education"],
  authors: [
    { name: "Francis Reuben R" },
    { name: "Darshan Jain" },
    { name: "Harshith B A" }
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "DevPath - Learn by Building",
    description: "Project-Driven Programming Learning Platform",
    siteName: "DevPath",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPath - Learn by Building",
    description: "Project-Driven Programming Learning Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
