import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setSession, USERNAME_RE } from "@/lib/auth";
import { emptyProfile, getSeedProfile } from "@/lib/profiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const username = String(body?.username ?? "").trim().toLowerCase();
  const passcode = String(body?.passcode ?? "");

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { ok: false, error: "username must be 1–20 chars: a–z, 0–9, _" },
      { status: 400 }
    );
  }
  if (passcode.length < 4) {
    return NextResponse.json(
      { ok: false, error: "passcode must be at least 4 characters" },
      { status: 400 }
    );
  }
  if (getSeedProfile(username)) {
    return NextResponse.json({ ok: false, error: "that username is reserved" }, { status: 409 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "username already taken" }, { status: 409 });
  }

  const passHash = await hashPassword(passcode);
  const base = emptyProfile(username);
  const user = await prisma.user.create({
    data: {
      username,
      passHash,
      profile: {
        create: {
          username,
          displayName: base.displayName,
          bio: base.bio,
          taglines: base.taglines,
          avatar: base.avatar,
          accent: base.accent,
          background: base.background,
          socials: base.socials as any,
          links: base.links as any,
        },
      },
    },
  });

  await setSession({ uid: user.id, username });
  return NextResponse.json({ ok: true, username });
}
