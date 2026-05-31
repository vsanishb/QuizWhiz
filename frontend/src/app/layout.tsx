import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "QuizWhiz",
  description: "QuizWhiz is your go-to platform for creating, sharing, and taking quizzes. Whether you're a student looking to test your knowledge, a teacher wanting to engage your class, or just someone who loves trivia, QuizWhiz has something for everyone. With an intuitive interface and a wide range of quiz categories, you can easily create your own quizzes or explore those made by others. Join our community of quiz enthusiasts and start quizzing today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
