import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser, setSession, USERNAME_RE } from "@/lib/auth";
import { getSeedProfile } from "@/lib/profiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOLDOWN_DAYS = 14;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const next = String(body?.username ?? "").trim().toLowerCase();
  if (!USERNAME_RE.test(next)) {
    return NextResponse.json(
      { ok: false, error: "username must be 1–20 chars: a–z, 0–9, _" },
      { status: 400 }
    );
  }
  if (next === session.username) {
    return NextResponse.json({ ok: false, error: "that's already your username" }, { status: 400 });
  }
  if (getSeedProfile(next)) {
    return NextResponse.json({ ok: false, error: "that username is reserved" }, { status: 409 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.uid } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // enforce the once-per-14-days cooldown
  if (user.usernameChangedAt) {
    const elapsed = Date.now() - user.usernameChangedAt.getTime();
    if (elapsed < COOLDOWN_MS) {
      const daysLeft = Math.ceil((COOLDOWN_MS - elapsed) / (24 * 60 * 60 * 1000));
      return NextResponse.json(
        { ok: false, error: `you can change your username again in ${daysLeft} day${daysLeft === 1 ? "" : "s"}` },
        { status: 429 }
      );
    }
  }

  const taken = await prisma.user.findUnique({ where: { username: next } });
  if (taken) {
    return NextResponse.json({ ok: false, error: "username already taken" }, { status: 409 });
  }

  try {
    // username is denormalized onto Profile too — update both atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { username: next, usernameChangedAt: new Date() },
      }),
      prisma.profile.update({
        where: { username: session.username },
        data: { username: next },
      }),
    ]);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ ok: false, error: "username already taken" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "could not change username" }, { status: 500 });
  }

  // re-issue the session cookie with the new username
  await setSession({ uid: user.id, username: next });
  return NextResponse.json({ ok: true, username: next });
}
