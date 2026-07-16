import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Kind = "avatar" | "background" | "music" | "cursor";

const LIMITS: Record<Kind, { max: number; types: string[] }> = {
  avatar: { max: 5 * 1024 * 1024, types: ["image/png", "image/jpeg", "image/gif", "image/webp"] },
  background: {
    max: 30 * 1024 * 1024,
    types: ["image/png", "image/jpeg", "image/gif", "image/webp", "video/mp4", "video/webm"],
  },
  music: {
    max: 15 * 1024 * 1024,
    types: ["audio/mpeg", "audio/ogg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/m4a", "audio/flac"],
  },
  cursor: {
    max: 1 * 1024 * 1024,
    types: ["image/png", "image/gif", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"],
  },
};

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const kind = String(form.get("kind") || "") as Kind;
  const file = form.get("file");
  const cfg = LIMITS[kind];
  if (!cfg) return NextResponse.json({ ok: false, error: "invalid upload kind" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "no file" }, { status: 400 });
  if (file.size > cfg.max) {
    return NextResponse.json(
      { ok: false, error: `file too large (max ${Math.round(cfg.max / 1024 / 1024)}MB)` },
      { status: 413 }
    );
  }
  if (file.type && !cfg.types.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "unsupported file type" }, { status: 415 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "uploads aren't configured yet (set BLOB_READ_WRITE_TOKEN)" },
      { status: 501 }
    );
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  const key = `${kind}/${session.username}-${Date.now()}.${ext}`;

  try {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return NextResponse.json({ ok: true, url: blob.url, isVideo: file.type.startsWith("video/") });
  } catch {
    return NextResponse.json({ ok: false, error: "upload failed" }, { status: 500 });
  }
}
