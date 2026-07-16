"use client";

// Client-side API wrappers. All persistence now lives in the database behind
// these routes; the browser only talks HTTP + a httpOnly session cookie.

import { Profile } from "./profiles";

export type AuthResult = { ok: true; username: string } | { ok: false; error: string };

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: "network error" }));
}

export function register(username: string, passcode: string): Promise<AuthResult> {
  return postJson("/api/auth/register", { username, passcode });
}

export function login(username: string, passcode: string): Promise<AuthResult> {
  return postJson("/api/auth/login", { username, passcode });
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

/** A partial profile update; `music: null` explicitly clears the track. */
export type ProfilePatch = Partial<Omit<Profile, "music">> & { music?: Profile["music"] | null };

/** Partial profile update — only the keys you pass are changed. */
export async function saveProfile(patch: ProfilePatch): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  return res.json().catch(() => ({ ok: false, error: "network error" }));
}

export type UploadKind = "avatar" | "background" | "music" | "cursor";

export async function uploadMedia(
  kind: UploadKind,
  file: File
): Promise<{ ok: boolean; url?: string; isVideo?: boolean; error?: string }> {
  const form = new FormData();
  form.append("kind", kind);
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  return res.json().catch(() => ({ ok: false, error: "network error" }));
}

export async function changeUsername(
  username: string
): Promise<{ ok: boolean; username?: string; error?: string }> {
  return postJson("/api/account/username", { username });
}
