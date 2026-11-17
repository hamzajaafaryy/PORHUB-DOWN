import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://porhub-down.vercel.app"),
  title: { default: "PorHub Down — Video Download Helper", template: "%s | PorHub Down" },
  description: "A simple video download helper for direct video files you own or are authorized to download.",
  applicationName: "PorHub Down",
  robots: { index: true, follow: true },
  openGraph: { title: "PorHub Down", description: "A clean, simple helper for authorized video downloads.", type: "website" },
  twitter: { card: "summary_large_image", title: "PorHub Down", description: "Download direct video files you are authorized to save." }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
