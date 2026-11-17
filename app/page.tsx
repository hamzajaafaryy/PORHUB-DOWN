"use client";

import { FormEvent, useMemo, useState } from "react";

function parsedUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed : null;
  } catch { return null; }
}
function isPornhubWatchPage(value: string) {
  const parsed = parsedUrl(value);
  if (!parsed) return false;
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  return (host === "pornhub.com" || host.endsWith(".pornhub.com")) &&
    (parsed.pathname.toLowerCase().includes("view_video") || parsed.searchParams.has("viewkey") || parsed.pathname.length > 1);
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const pornhubPage = useMemo(() => isPornhubWatchPage(url.trim()), [url]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const parsed = parsedUrl(url.trim());
    if (!parsed) {
      setMessage("Enter a valid http or https video URL.");
      return;
    }
    if (pornhubPage) {
      setMessage("This is a Pornhub watch page, not a direct media file. We can't extract protected player streams. For content you own, use the platform's official creator export and paste its direct media-file URL.");
      return;
    }
    setBusy(true);
    setMessage("Preparing your download… Your browser will open the secure download endpoint.");
    window.location.assign("/api/download?url=" + encodeURIComponent(parsed.toString()));
    window.setTimeout(() => setBusy(false), 4000);
  }

  return (
    <main className="page-shell">
      <nav className="nav wrap">
        <a className="brand" href="/" aria-label="PorHub Down home"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a>
        <span className="nav-pill"><i /> DIRECT VIDEO DOWNLOADER</span>
      </nav>
      <section className="hero wrap">
        <div className="eyebrow"><span className="spark">✦</span> YOUR VIDEO. YOUR CONTROL.</div>
        <h1>Video downloads,<br /><em>made simple.</em></h1>
        <p className="intro">Paste an accessible direct video-file URL and download it through a secure, temporary stream. No account and no file storage.</p>
        <div className="download-card">
          <div className="card-top"><div><span className="step">01</span><span className="card-label">PASTE VIDEO URL</span></div><span className="secure"><span>●</span> SECURE LINK CHECK</span></div>
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="video-url">Video URL</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.72M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.72-1.72" /></svg>
              <input id="video-url" type="url" placeholder="https://example.com/my-video.mp4" value={url} onChange={e => { setUrl(e.target.value); setMessage(""); }} autoComplete="url" required />
              {url && <button className="clear" type="button" onClick={() => { setUrl(""); setMessage(""); }} aria-label="Clear URL">×</button>}
            </div>
            <button className="download-btn" type="submit" disabled={!url.trim() || busy}>{busy ? "Preparing…" : "Download video"} <span>↓</span></button>
          </form>
          {message && <div className="notice" role="status">{message}</div>}
          {pornhubPage && <a className="source-link" href={url.trim()} target="_blank" rel="noopener noreferrer">Open this Pornhub page ↗</a>}
          <div className="card-foot"><span><b>✓</b> No account required</span><span><b>✓</b> Streamed, not stored</span><span><b>✓</b> Size-limited for safety</span></div>
        </div>
        <div className="supported"><span className="supported-line" />SUPPORTED VIDEO FORMATS <b>MP4</b><b>WEBM</b><b>MOV</b><b>M4V</b><b>OGV</b><span className="supported-line" /></div>
      </section>
      <section className="how wrap">
        <div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Three steps. <em>That’s it.</em></h2></div>
        <div className="steps">
          <article><span className="number">01</span><div className="step-icon">↗</div><h3>Paste a direct URL</h3><p>Use a public direct link to an MP4, WebM, MOV, M4V, or OGV file that you own or may download.</p></article>
          <article><span className="number">02</span><div className="step-icon">⌁</div><h3>We check the source</h3><p>The server validates the address, follows a limited number of safe redirects, and checks the returned media type.</p></article>
          <article><span className="number">03</span><div className="step-icon">↓</div><h3>Download your file</h3><p>The video is streamed to your browser with an attachment filename. It is not saved on our server.</p></article>
        </div>
      </section>
      <section className="notice-panel wrap"><div className="notice-icon">i</div><div><h3>Supported links and platform restrictions</h3><p>This tool downloads accessible direct media-file URLs only. A Pornhub watch-page URL is not a direct video file, and this service does not extract player streams, decrypt media, bypass authentication, or defeat platform restrictions. Use official creator export tools for content you own, then paste the authorized direct file URL.</p></div></section>
      <footer className="footer wrap"><a className="brand footer-brand" href="/"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a><span>Built for authorized video downloads. Respect creators and content rights.</span><span>© {new Date().getFullYear()} PorHub Down</span></footer>
    </main>
  );
}
