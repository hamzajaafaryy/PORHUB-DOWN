# PorHub Down

A polished Next.js helper for downloading **direct video-file URLs** that the visitor owns or is authorized to save.

## Stack
- Next.js 15 / React 19 / TypeScript
- Responsive custom CSS
- Metadata, Open Graph, robots.txt and sitemap

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Scope and limitations
This app does not extract media streams from Pornhub watch pages, scrape protected endpoints, decrypt player data, bypass authentication, or evade platform download controls. A page URL is not a direct video-file URL. For creator-owned media, use the platform's official creator download/export feature, then provide a direct MP4/WebM URL if the host permits browser downloads.

The app does not upload or store submitted URLs. The browser requests the direct file from its original host. Cross-origin download behavior is controlled by that host and the user's browser; some servers may stream the file in a tab instead of honoring the download attribute.

## Deploy
Import this repository into Vercel and use the default Next.js build settings.
