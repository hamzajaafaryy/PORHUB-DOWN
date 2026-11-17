import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://porhub-down.vercel.app"),
  title: { default: "PorHub Down — Pornhub Link Checker & Video Downloader", template: "%s | PorHub Down" },
  description: "Check Pornhub watch-page links and download authorized direct video files in MP4, WebM, MOV, M4V, and OGV formats.",
  applicationName: "PorHub Down",
  robots: { index: true, follow: true },
  openGraph: {
    title: "PorHub Down — Video Downloader",
    description: "A straightforward Pornhub link checker and authorized direct video-file downloader.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "PorHub Down — Video Downloader",
    description: "Check video links and download supported direct media files."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
