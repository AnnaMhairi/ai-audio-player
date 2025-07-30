import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AudioPlayer from "./components/AudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Audio Player",
  description: "Mock project for interview prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Nav */}
        <header className="p-4 bg-white shadow flex justify-between">
          <Link href="/" className="font-bold">Home</Link>
          <Link href="/library" className="font-bold">Library</Link>
        </header>

         {/* Main content */}
         <main className="flex-1 p-4">{children}</main>

        {/* Persistent Audio Player */}
        <footer className="p-4 border-t">
          <AudioPlayer />
        </footer>
      </body>
    </html>
  );
}
