"use client";

import { FormEvent, useMemo, useState } from "react";

function isHttpUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; }
  catch { return false; }
}
function isVideoFile(value: string) {
  try {
    const path = new URL(value).pathname.toLowerCase();
    return /\.(mp4|webm|mov|m4v|ogv)(?:$)/.test(path);
  } catch { return false; }
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const directFile = useMemo(() => isHttpUrl(url.trim()) && isVideoFile(url.trim()), [url]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!isHttpUrl(url.trim())) {
      setMessage("Enter a valid http or https video URL.");
      return;
    }
    if (!directFile) {
      setMessage("This looks like a webpage link, not a direct video file. PorHub Down does not extract streams from Pornhub pages or bypass download restrictions. If it is your video, use the download/export option in your creator account, then paste the direct MP4/WebM file URL here.");
      return;
    }
    setBusy(true);
    const anchor = document.createElement("a");
    anchor.href = url.trim();
    anchor.download = "";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setBusy(false);
    setMessage("Your browser has been asked to download the direct video file. The source host may open it in a new tab or restrict cross-origin downloads.");
  }

  return (
    <main className="page-shell">
      <nav className="nav wrap">
        <a className="brand" href="/" aria-label="PorHub Down home"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a>
        <span className="nav-pill"><i /> SIMPLE VIDEO TOOL</span>
      </nav>

      <section className="hero wrap">
        <div className="eyebrow"><span className="spark">✦</span> YOUR VIDEO. YOUR CONTROL.</div>
        <h1>Video downloads,<br /><em>made simple.</em></h1>
        <p className="intro">Paste a direct video file link and save it to your device. Clean, quick, and designed to stay out of your way.</p>

        <div className="download-card">
          <div className="card-top"><div><span className="step">01</span><span className="card-label">PASTE VIDEO URL</span></div><span className="secure"><span>●</span> LINK CHECK</span></div>
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="video-url">Video URL</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.72M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.72-1.72" /></svg>
              <input id="video-url" type="url" placeholder="https://example.com/video.mp4" value={url} onChange={e => { setUrl(e.target.value); setMessage(""); }} autoComplete="url" />
              {url && <button className="clear" type="button" onClick={() => { setUrl(""); setMessage(""); }} aria-label="Clear URL">×</button>}
            </div>
            <button className="download-btn" type="submit" disabled={!url.trim() || busy}>{busy ? "Preparing…" : "Download video"} <span>↗</span></button>
          </form>
          {message && <div className={directFile ? "notice success" : "notice"} role="status">{message}</div>}
          <div className="card-foot"><span><b>✓</b> No account required</span><span><b>✓</b> Direct file links only</span><span><b>✓</b> No files stored here</span></div>
        </div>

        <div className="supported"><span className="supported-line" />SUPPORTED FILES <b>MP4</b><b>WEBM</b><b>MOV</b><b>M4V</b><span className="supported-line" /></div>
      </section>

      <section className="how wrap">
        <div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Three steps. <em>That’s it.</em></h2></div>
        <div className="steps">
          <article><span className="number">01</span><div className="step-icon">↗</div><h3>Copy a direct link</h3><p>Use a direct MP4, WebM, or other supported video-file URL.</p></article>
          <article><span className="number">02</span><div className="step-icon">⌁</div><h3>Paste it above</h3><p>We check the URL format in your browser. No upload is made to our server.</p></article>
          <article><span className="number">03</span><div className="step-icon">↓</div><h3>Save your video</h3><p>Your browser requests the file from its original host.</p></article>
        </div>
      </section>

      <section className="notice-panel wrap"><div className="notice-icon">i</div><div><h3>About Pornhub page links</h3><p>A Pornhub watch-page URL is not a direct video-file URL. This site does not scrape, decrypt, or extract protected streams. Creators should use the platform’s own download/export controls for their content.</p></div></section>
      <footer className="footer wrap"><a className="brand footer-brand" href="/"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a><span>Built for direct video links. Respect creators and content rights.</span><span>© {new Date().getFullYear()} PorHub Down</span></footer>
    </main>
  );
}
