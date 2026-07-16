import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, setSession } from "@/lib/auth";

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

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await verifyPassword(passcode, user.passHash))) {
    return NextResponse.json({ ok: false, error: "invalid username or passcode" }, { status: 401 });
  }

  await setSession({ uid: user.id, username: user.username });
  return NextResponse.json({ ok: true, username: user.username });
}
