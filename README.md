# PorHub Down

A responsive Next.js direct-video downloader for public media-file URLs that the visitor owns or is authorized to save.

## Stack
- Next.js 15 / React 19 / TypeScript
- Node.js streaming download route at `/api/download`
- Responsive custom CSS, metadata, Open Graph, robots.txt and sitemap

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## How downloads work
- Paste an accessible direct URL to an MP4, WebM, MOV, M4V, or OGV file.
- The server checks HTTP/HTTPS, rejects private/local network destinations, limits redirects, validates the returned video MIME type, and streams the file as an attachment.
- Maximum download size: 300 MB. Files are streamed and are not intentionally stored on the application server.
- Some hosts block server-side requests or require cookies, login, or signed URLs. Those sources may not work.
- The downloader does not support webpage/watch-page URLs as media sources.

## Platform restrictions
Pornhub watch-page URLs are not direct media files. This app does not scrape player streams, decrypt media, bypass authentication, defeat DRM, or evade platform download controls. For creator-owned media, use the platform's official creator download/export feature and provide an accessible direct file URL where downloads are permitted.

## Security notes
The download route accepts only HTTP/HTTPS URLs, rejects credentials and private/local destinations after DNS resolution, revalidates redirects, restricts response MIME types, applies a 300 MB limit, and disables caching. Do not expose this endpoint to untrusted high-volume traffic without rate limiting and infrastructure-level abuse controls.

## Deploy
Import this repository into Vercel and use the default Next.js build settings. The route requires the Node.js runtime.
