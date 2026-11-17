"use client";

import { FormEvent, useMemo, useState } from "react";

function parseUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch { return null; }
}

function isPornhubWatchPage(value: string) {
  const url = parseUrl(value);
  if (!url) return false;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  return (host === "pornhub.com" || host.endsWith(".pornhub.com")) &&
    (url.pathname.toLowerCase().includes("view_video") || url.searchParams.has("viewkey"));
}

function isDirectVideoFile(value: string) {
  const url = parseUrl(value);
  return !!url && /\.(mp4|webm|mov|m4v|ogv)$/i.test(url.pathname);
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const pornhubPage = useMemo(() => isPornhubWatchPage(url), [url]);
  const directFile = useMemo(() => isDirectVideoFile(url), [url]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const parsed = parseUrl(url);
    if (!parsed) {
      setMessage("Please paste a valid HTTP or HTTPS URL.");
      return;
    }
    if (pornhubPage) {
      setMessage("Pornhub watch-page detected. A watch-page URL is not a video file. This tool does not extract player streams or bypass platform restrictions. For content you own, use an official creator download/export option, then paste the resulting direct video-file URL.");
      return;
    }
    if (!directFile) {
      setMessage("This does not look like a direct MP4, WebM, MOV, M4V, or OGV file URL. Paste an authorized direct media-file link.");
      return;
    }
    setBusy(true);
    window.location.assign("/api/download?url=" + encodeURIComponent(parsed.toString()));
    setMessage("If the source host is enabled and permits server-side access, your download will begin. Otherwise, check the source URL or allowed-host configuration.");
    window.setTimeout(() => setBusy(false), 3500);
  }

  return (
    <main className="page-shell">
      <nav className="nav wrap">
        <a className="brand" href="/" aria-label="PorHub Down home"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a>
        <span className="nav-pill"><i /> PORNHUB LINK CHECKER</span>
      </nav>
      <section className="hero wrap">
        <div className="eyebrow"><span className="spark">✦</span> SIMPLE. PRIVATE. TRANSPARENT.</div>
        <h1>Pornhub links,<br /><em>made clearer.</em></h1>
        <p className="intro">Check a Pornhub watch-page link or download an authorized direct video file. Paste your link below to see the supported option.</p>
        <div className="download-card">
          <div className="card-top"><div><span className="step">01</span><span className="card-label">PASTE YOUR VIDEO URL</span></div><span className="secure"><span>●</span> LINK VALIDATION</span></div>
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="video-url">Video URL</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.72M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.72-1.72" /></svg>
              <input id="video-url" type="url" placeholder="Paste a Pornhub page URL or direct video file URL…" value={url} onChange={e => { setUrl(e.target.value); setMessage(""); }} autoComplete="url" required />
              {url && <button className="clear" type="button" onClick={() => { setUrl(""); setMessage(""); }} aria-label="Clear URL">×</button>}
            </div>
            <button className="download-btn" type="submit" disabled={!url.trim() || busy}>{busy ? "Checking…" : pornhubPage ? "Check Pornhub link" : "Download direct video"} <span>↓</span></button>
          </form>
          {message && <div className="notice" role="status">{message}</div>}
          {pornhubPage && <a className="source-link" href={url.trim()} target="_blank" rel="noopener noreferrer">Open this Pornhub page ↗</a>}
          <div className="card-foot"><span><b>✓</b> No account on this site</span><span><b>✓</b> No video storage</span><span><b>✓</b> Direct-file support</span></div>
        </div>
        <div className="supported"><span className="supported-line" />DIRECT VIDEO FORMATS <b>MP4</b><b>WEBM</b><b>MOV</b><b>M4V</b><b>OGV</b><span className="supported-line" /></div>
      </section>
      <section className="how wrap">
        <div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Three simple steps.</h2></div>
        <div className="steps">
          <article><span className="number">01</span><div className="step-icon">↗</div><h3>Paste the Pornhub link</h3><p>We identify a supported Pornhub watch-page URL and explain which download options are available.</p></article>
          <article><span className="number">02</span><div className="step-icon">⌁</div><h3>Check the source type</h3><p>A watch page is different from a direct video file. The app never pretends a page URL is an MP4 download.</p></article>
          <article><span className="number">03</span><div className="step-icon">↓</div><h3>Download an authorized file</h3><p>Paste an accessible direct video-file URL from a source you are allowed to download.</p></article>
        </div>
      </section>
      <section className="notice-panel wrap"><div className="notice-icon">i</div><div><h3>Important: Pornhub watch pages</h3><p>A public watch-page URL does not itself provide a downloadable media file. This project does not scrape or decrypt player streams, bypass login, defeat DRM, or circumvent platform download controls. For videos you own or are authorized to save, use an official download/export method and then use the direct file URL if the host permits it.</p></div></section>
      <footer className="footer wrap"><a className="brand footer-brand" href="/"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a><span>For authorized downloads. Respect creators and platform rules.</span><span>© {new Date().getFullYear()} PorHub Down</span></footer>
    </main>
  );
}
