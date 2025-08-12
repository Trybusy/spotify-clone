import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import { PlayerProvider } from "@/context/PlayerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Minimal Spotify-like player",
  icons: {
    icon: "https://www.svgrepo.com/show/433978/spotify.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        <PlayerProvider>
          <div className="flex min-h-screen pb-24">
            {/* Sidebar navigation */}
            <Sidebar />
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
          </div>
          <Player />
        </PlayerProvider>
      </body>
    </html>
  );
}
