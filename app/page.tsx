"use client";

import { FormEvent, useMemo, useState } from "react";

function parsedUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed : null;
  } catch { return null; }
}
function isVideoFile(value: string) {
  const parsed = parsedUrl(value);
  return !!parsed && /\.(mp4|webm|mov|m4v|ogv)$/i.test(parsed.pathname);
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
  const directFile = useMemo(() => isVideoFile(url.trim()), [url]);
  const pornhubPage = useMemo(() => isPornhubWatchPage(url.trim()), [url]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!parsedUrl(url.trim())) {
      setMessage("Enter a valid http or https video URL.");
      return;
    }
    if (pornhubPage) {
      setMessage("Pornhub page recognized. A watch-page link is not a downloadable video file. If this is your content, use Pornhub's official creator download/export option. Paste the resulting direct video-file URL here if downloads are permitted by the host.");
      return;
    }
    if (!directFile) {
      setMessage("This is a webpage link, not a direct video file. We don't extract protected streams or bypass download restrictions. Use the site's official download/export option, then paste the direct MP4/WebM file URL here.");
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
        <p className="intro">Paste a direct video file link or a Pornhub page URL to check what download options are available.</p>

        <div className="download-card">
          <div className="card-top"><div><span className="step">01</span><span className="card-label">PASTE VIDEO URL</span></div><span className="secure"><span>●</span> LINK CHECK</span></div>
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="video-url">Video URL</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.72M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.72-1.72" /></svg>
              <input id="video-url" type="url" placeholder="https://www.pornhub.com/view_video.php?viewkey=… or direct-video.mp4" value={url} onChange={e => { setUrl(e.target.value); setMessage(""); }} autoComplete="url" />
              {url && <button className="clear" type="button" onClick={() => { setUrl(""); setMessage(""); }} aria-label="Clear URL">×</button>}
            </div>
            <button className="download-btn" type="submit" disabled={!url.trim() || busy}>{busy ? "Checking…" : "Check download options"} <span>↗</span></button>
          </form>
          {message && <div className={directFile ? "notice success" : "notice"} role="status">{message}</div>}
          {pornhubPage && <a className="source-link" href={url.trim()} target="_blank" rel="noopener noreferrer">Open this Pornhub page ↗</a>}
          <div className="card-foot"><span><b>✓</b> No account required</span><span><b>✓</b> URL checked in browser</span><span><b>✓</b> No files stored here</span></div>
        </div>

        <div className="supported"><span className="supported-line" />SUPPORTED FILES <b>MP4</b><b>WEBM</b><b>MOV</b><b>M4V</b><span className="supported-line" /></div>
      </section>

      <section className="how wrap">
        <div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Three steps. <em>That’s it.</em></h2></div>
        <div className="steps">
          <article><span className="number">01</span><div className="step-icon">↗</div><h3>Paste a video URL</h3><p>Use a Pornhub watch-page URL or a direct MP4, WebM, or other supported file link.</p></article>
          <article><span className="number">02</span><div className="step-icon">⌁</div><h3>We identify the link</h3><p>Pornhub page links are recognized separately from direct video files. No stream extraction is performed.</p></article>
          <article><span className="number">03</span><div className="step-icon">↓</div><h3>Use an authorized file</h3><p>Download direct files when the source host permits it, or use the platform's creator export tools.</p></article>
        </div>
      </section>

      <section className="notice-panel wrap"><div className="notice-icon">i</div><div><h3>About Pornhub page links</h3><p>This version recognizes Pornhub watch-page URLs, but it does not extract, decrypt, or bypass protected media streams. For videos you own or are authorized to save, use Pornhub's official creator download/export controls and then provide an accessible direct video-file URL.</p></div></section>
      <footer className="footer wrap"><a className="brand footer-brand" href="/"><span className="brand-mark">P</span><span>PORHUB<span className="brand-light">DOWN</span></span></a><span>Built for authorized video downloads. Respect creators and content rights.</span><span>© {new Date().getFullYear()} PorHub Down</span></footer>
    </main>
  );
}
