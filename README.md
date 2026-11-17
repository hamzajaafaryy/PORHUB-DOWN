# PorHub Down

A responsive Next.js helper that recognizes Pornhub watch-page URLs and supports direct video-file URLs that the visitor owns or is authorized to save.

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

## URL behavior
- Pornhub watch-page URLs are recognized and identified in the interface.
- Direct MP4, WebM, MOV, M4V, and OGV file URLs are passed to the browser's download flow.
- Other webpage URLs receive an explanation and guidance to use the source platform's official download/export controls.

## Scope and limitations
Recognizing a Pornhub page URL does not mean its player stream is a downloadable file. This app does not scrape media streams, decrypt player data, bypass authentication, defeat DRM, or evade platform download controls. For creator-owned media, use the platform's official creator download/export feature, then provide an accessible direct video-file URL where downloads are permitted.

The app does not upload or store submitted URLs. The browser requests direct files from their original host. Cross-origin download behavior is controlled by that host and the user's browser; some servers may stream the file in a tab instead of honoring the download attribute.

## Deploy
Import this repository into Vercel and use the default Next.js build settings.
