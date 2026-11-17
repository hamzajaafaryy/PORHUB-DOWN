# PorHub Down

A Pornhub-focused link checker and direct-video downloader built with Next.js 15, React 19, and TypeScript.

## Important platform behavior
A Pornhub watch-page URL (for example, `/view_video.php?viewkey=...`) is a webpage, not a direct media-file URL. This project recognizes supported watch-page URLs but does not extract or decrypt player streams, bypass authentication, defeat DRM, or circumvent platform download restrictions. For content you own or are authorized to save, use an official creator download/export method and provide an accessible direct video-file URL where permitted.

## Direct-file downloads
The `/api/download` route streams supported direct video files as attachments. It accepts HTTPS URLs only and checks:
- Explicit source-domain allowlist via `DOWNLOAD_ALLOWED_HOSTS`
- Public DNS/IP destinations
- Redirect destinations (maximum three redirects)
- Video MIME type (MP4, WebM, MOV, M4V, OGV)
- 300 MB maximum response size
- 25-second upstream request timeout

The app does not intentionally store downloaded videos. Some hosts block server-side requests, require authorization, or do not permit server-side downloads; those sources will not work.

## Configure on Vercel
In Project Settings → Environment Variables, add:

```text
DOWNLOAD_ALLOWED_HOSTS=media.example.com,cdn.example.net
```

Use only domains you trust and have permission to download from. Include the exact hostnames that serve your authorized direct media files. Do not add broad unrelated domains. Redeploy after changing the variable. With no allowlist configured, the download endpoint returns HTTP 503 by design.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Deploy
Import this repository into Vercel and use the default Next.js build settings. The download route uses the Node.js runtime. Configure the environment variable above before expecting direct-file downloads to work.

## Abuse prevention
For a public production service, add rate limiting and request quotas at the edge or through a trusted service. Keep the source-host allowlist narrow. Do not use this service to download content without permission.
