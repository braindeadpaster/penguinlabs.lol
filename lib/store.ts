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

export async function saveProfile(profile: Profile): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(profile),
  });
  return res.json().catch(() => ({ ok: false, error: "network error" }));
}
