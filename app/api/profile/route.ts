import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { sanitizeProfileInput, validMusic } from "@/lib/profile-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
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

  const data = sanitizeProfileInput(body);
  const music = validMusic(body?.music);

  try {
    await prisma.profile.update({
      where: { username: session.username },
      data: {
        ...data,
        // JSON columns must be handed to Prisma as InputJsonValue
        socials: data.socials as unknown as Prisma.InputJsonValue | undefined,
        links: data.links as unknown as Prisma.InputJsonValue | undefined,
        music: music ?? Prisma.DbNull,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
