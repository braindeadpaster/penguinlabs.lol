// ---------------------------------------------------------------------------
// Data model for a bio page. This is the single source of truth for both the
// public profile renderer and the dashboard editor. Persistence today is
// client-side (see lib/store.ts); swapping it for a real API + database later
// only means re-implementing the functions in store.ts, not this file.
// ---------------------------------------------------------------------------

export type SocialKind =
  | "discord"
  | "twitter"
  | "youtube"
  | "github"
  | "tiktok"
  | "spotify"
  | "telegram"
  | "twitch"
  | "instagram"
  | "website";

export const SOCIAL_KINDS: SocialKind[] = [
  "discord",
  "twitter",
  "youtube",
  "github",
  "tiktok",
  "spotify",
  "telegram",
  "twitch",
  "instagram",
  "website",
];

export interface SocialLink {
  kind: SocialKind;
  url: string;
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
}

export type BackgroundStyle = "particles" | "grid" | "plain";

export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  /** Multiple lines are typed out one after another on the public page. */
  taglines: string[];
  avatar: string;
  accent: string;
  background: BackgroundStyle;
  location?: string;
  socials: SocialLink[];
  links: CustomLink[];
  music?: { title: string; artist: string; url: string };
}

export function emptyProfile(username: string): Profile {
  return {
    username,
    displayName: username,
    bio: "",
    taglines: ["welcome to my page"],
    avatar: "/bud.png",
    accent: "#6fa8dc",
    background: "particles",
    socials: [],
    links: [],
  };
}

// A single seeded demo profile so the public renderer has something to show
// on a fresh deploy (before anyone registers). Deliberately neutral content.
export const SEED_PROFILES: Record<string, Profile> = {
  penguin: {
    username: "penguin",
    displayName: "Penguin Labs",
    bio: "the bio platform, by penguin labs.",
    taglines: ["stay low · stack high", "make it yours"],
    avatar: "/bud.png",
    accent: "#6fa8dc",
    background: "particles",
    location: "South London",
    socials: [{ kind: "discord", url: "https://discord.gg/84JYsTmsH" }],
    links: [
      { id: "site", label: "penguinlabs.lol", url: "https://penguinlabs.lol" },
    ],
  },
};

export function getSeedProfile(username: string): Profile | null {
  return SEED_PROFILES[username.toLowerCase()] ?? null;
}
