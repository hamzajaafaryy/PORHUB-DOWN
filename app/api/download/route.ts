import { lookup } from "node:dns/promises";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 300 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime", "video/x-m4v", "video/ogg"]);

function isPublicIp(ip: string) {
  if (isIP(ip) === 4) {
    const p = ip.split(".").map(Number);
    return !(p[0] === 10 || p[0] === 127 || p[0] === 0 || p[0] >= 224 ||
      (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127));
  }
  const normalized = ip.toLowerCase();
  return normalized !== "::" && normalized !== "::1" &&
    !normalized.startsWith("fc") && !normalized.startsWith("fd") &&
    !normalized.startsWith("fe8") && !normalized.startsWith("fe9") &&
    !normalized.startsWith("fea") && !normalized.startsWith("feb") &&
    !normalized.startsWith("::ffff:127.") && !normalized.startsWith("::ffff:10.") &&
    !normalized.startsWith("::ffff:192.168.");
}

async function validatePublicHost(url: URL) {
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Only HTTP and HTTPS links are supported.");
  if (url.username || url.password) throw new Error("URLs containing login credentials are not accepted.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) throw new Error("Private network addresses are not allowed.");
  if (isIP(host)) {
    if (!isPublicIp(host)) throw new Error("Private network addresses are not allowed.");
    return;
  }
  const addresses = await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(entry => !isPublicIp(entry.address))) throw new Error("The source host does not resolve to a public address.");
}

function safeFilename(value: string) {
  const cleaned = value.replace(/[\\/\r\n"<>:*?|\x00-\x1f]/g, "_").trim().slice(0, 120);
  return cleaned || "video-download";
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw || raw.length > 4096) return NextResponse.json({ error: "Please provide a valid direct video URL." }, { status: 400 });

  let current: URL;
  try { current = new URL(raw); await validatePublicHost(current); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid URL." }, { status: 400 }); }

  let upstream: Response | null = null;
  try {
    for (let hop = 0; hop <= 3; hop++) {
      upstream = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(25000), headers: { "user-agent": "PorHubDown/1.0" }, cache: "no-store" });
      if ([301, 302, 303, 307, 308].includes(upstream.status)) {
        const location = upstream.headers.get("location");
        if (!location || hop === 3) return NextResponse.json({ error: "Too many or invalid redirects from the source." }, { status: 502 });
        const next = new URL(location, current);
        await validatePublicHost(next);
        current = next;
        continue;
      }
      break;
    }
    if (!upstream || !upstream.ok || !upstream.body) return NextResponse.json({ error: "The source did not provide a downloadable file." }, { status: 502 });

    const type = (upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(type)) return NextResponse.json({ error: "The link did not return a supported video file. Use a direct MP4, WebM, MOV, M4V, or OGV URL." }, { status: 415 });

    const length = Number(upstream.headers.get("content-length") || 0);
    if (length > MAX_BYTES) return NextResponse.json({ error: "This file exceeds the 300 MB download limit." }, { status: 413 });

    const urlName = decodeURIComponent(current.pathname.split("/").pop() || "video-download").replace(/\+/g, " ");
    const filename = safeFilename(urlName.includes(".") ? urlName : "video-download." + (type === "video/webm" ? "webm" : type === "video/quicktime" ? "mov" : type === "video/ogg" ? "ogv" : "mp4"));
    let bytes = 0;
    const limited = upstream.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        bytes += chunk.byteLength;
        if (bytes > MAX_BYTES) {
          controller.error(new Error("File exceeds download size limit."));
          return;
        }
        controller.enqueue(chunk);
      }
    }));
    return new NextResponse(limited, {
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-transform",
        "X-Content-Type-Options": "nosniff",
        ...(length ? { "Content-Length": String(length) } : {})
      }
    });
  } catch {
    return NextResponse.json({ error: "Download failed. The source may be unavailable, slow, or blocking server-side access." }, { status: 502 });
  }
}
