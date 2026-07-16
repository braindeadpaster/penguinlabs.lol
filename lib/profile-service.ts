import "server-only";
import type { Profile as DbProfile } from "@prisma/client";
import { prisma } from "./db";
import {
  Profile,
  SocialLink,
  CustomLink,
  BackgroundStyle,
  SOCIAL_KINDS,
  getSeedProfile,
} from "./profiles";

export interface PublicProfile {
  profile: Profile;
  views: number;
}

function toProfile(p: DbProfile): Profile {
  return {
    username: p.username,
    displayName: p.displayName,
    bio: p.bio,
    taglines: (p.taglines as string[]) ?? [],
    avatar: p.avatar,
    accent: p.accent,
    background: p.background as BackgroundStyle,
    location: p.location ?? undefined,
    socials: (p.socials as unknown as SocialLink[]) ?? [],
    links: (p.links as unknown as CustomLink[]) ?? [],
    music: (p.music as unknown as Profile["music"]) ?? undefined,
  };
}

/** The signed-in owner's own profile (no view increment). */
export async function getOwnProfile(username: string): Promise<Profile | null> {
  const p = await prisma.profile.findUnique({ where: { username: username.toLowerCase() } });
  return p ? toProfile(p) : null;
}

/** A public page view: reads the profile and bumps its view counter. Falls back
 *  to a seeded demo profile so the site isn't empty before anyone registers. */
export async function getPublicProfile(username: string): Promise<PublicProfile | null> {
  const uname = username.toLowerCase();
  const p = await prisma.profile.findUnique({ where: { username: uname } });
  if (p) {
    // fire-and-forget; a failed counter update must not break the page
    prisma.profile
      .update({ where: { username: uname }, data: { views: { increment: 1 } } })
      .catch(() => {});
    return { profile: toProfile(p), views: p.views + 1 };
  }
  const seed = getSeedProfile(uname);
  return seed ? { profile: seed, views: 0 } : null;
}

// ---- input sanitizing (mass-assignment guard for PUT /api/profile) ----------

function validSocial(s: unknown): s is SocialLink {
  return (
    !!s &&
    typeof s === "object" &&
    typeof (s as any).url === "string" &&
    SOCIAL_KINDS.includes((s as any).kind)
  );
}

function cleanLink(l: any): CustomLink {
  return {
    id: typeof l.id === "string" && l.id ? l.id.slice(0, 40) : Math.random().toString(36).slice(2, 9),
    label: String(l.label ?? "").slice(0, 60),
    url: String(l.url ?? "").slice(0, 500),
  };
}

/** Everything an editor may change — except music, handled separately so it can
 *  be explicitly cleared. Never trusts username / views / ids from the client. */
export function sanitizeProfileInput(body: any): Partial<Profile> {
  const out: Partial<Profile> = {};
  if (typeof body?.displayName === "string") out.displayName = body.displayName.slice(0, 60) || "unnamed";
  if (typeof body?.bio === "string") out.bio = body.bio.slice(0, 300);
  if (Array.isArray(body?.taglines))
    out.taglines = body.taglines
      .filter((t: unknown) => typeof t === "string" && t.length)
      .slice(0, 6)
      .map((t: string) => t.slice(0, 80));
  if (typeof body?.avatar === "string") out.avatar = body.avatar.slice(0, 500) || "/bud.png";
  if (typeof body?.accent === "string" && /^#[0-9a-fA-F]{3,8}$/.test(body.accent)) out.accent = body.accent;
  if (body?.background === "particles" || body?.background === "grid" || body?.background === "plain")
    out.background = body.background;
  if (typeof body?.location === "string") out.location = body.location.slice(0, 60);
  if (Array.isArray(body?.socials))
    out.socials = body.socials.filter(validSocial).slice(0, 12) as SocialLink[];
  if (Array.isArray(body?.links)) out.links = body.links.filter((l: any) => l && typeof l === "object").slice(0, 20).map(cleanLink);
  return out;
}

/** Returns a clean music object, or null to clear it. */
export function validMusic(m: any): Profile["music"] | null {
  if (m && typeof m === "object" && typeof m.url === "string" && m.url.trim()) {
    return {
      title: String(m.title ?? "").slice(0, 80),
      artist: String(m.artist ?? "").slice(0, 80),
      url: String(m.url).slice(0, 500),
    };
  }
  return null;
}
