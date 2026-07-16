"use client";

// ---------------------------------------------------------------------------
// Client-side persistence stand-in.
//
// IMPORTANT: this is a PREVIEW backend. Accounts and profiles live in the
// browser's localStorage so the whole flow (register -> customize -> view) is
// demoable on a static deploy with zero secrets. It is NOT real multi-user auth
// and NOT secure — do not treat it as such. Replacing these functions with
// calls to a real API (Auth.js + a database) is the phase-2 upgrade and touches
// only this file.
// ---------------------------------------------------------------------------

import { Profile, emptyProfile, getSeedProfile } from "./profiles";

const SESSION_KEY = "penguin.session";
const usersKey = "penguin.users";
const profileKey = (username: string) => `penguin.profile.${username.toLowerCase()}`;

function isBrowser() {
  return typeof window !== "undefined";
}

interface Account {
  username: string;
  // Demo only. Never store real passwords like this in production.
  passcode: string;
}

function readUsers(): Account[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(usersKey) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: Account[]) {
  if (!isBrowser()) return;
  localStorage.setItem(usersKey, JSON.stringify(users));
}

export function currentUser(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(SESSION_KEY);
}

export function logout() {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
}

export type AuthResult = { ok: true; username: string } | { ok: false; error: string };

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export function register(username: string, passcode: string): AuthResult {
  username = username.trim().toLowerCase();
  if (!USERNAME_RE.test(username)) {
    return { ok: false, error: "username must be 3–20 chars: a–z, 0–9, _" };
  }
  if (passcode.length < 4) {
    return { ok: false, error: "passcode must be at least 4 characters" };
  }
  if (getSeedProfile(username)) {
    return { ok: false, error: "that username is reserved" };
  }
  const users = readUsers();
  if (users.some((u) => u.username === username)) {
    return { ok: false, error: "username already taken" };
  }
  users.push({ username, passcode });
  writeUsers(users);
  saveProfile(emptyProfile(username));
  localStorage.setItem(SESSION_KEY, username);
  return { ok: true, username };
}

export function login(username: string, passcode: string): AuthResult {
  username = username.trim().toLowerCase();
  const users = readUsers();
  const acct = users.find((u) => u.username === username);
  if (!acct || acct.passcode !== passcode) {
    return { ok: false, error: "invalid username or passcode" };
  }
  localStorage.setItem(SESSION_KEY, username);
  return { ok: true, username };
}

export function saveProfile(profile: Profile) {
  if (!isBrowser()) return;
  localStorage.setItem(profileKey(profile.username), JSON.stringify(profile));
}

/** Resolve a profile: the browser's saved copy first, then a seeded demo. */
export function loadProfile(username: string): Profile | null {
  if (isBrowser()) {
    const raw = localStorage.getItem(profileKey(username));
    if (raw) {
      try {
        return JSON.parse(raw) as Profile;
      } catch {
        /* fall through to seed */
      }
    }
  }
  return getSeedProfile(username);
}

export function usernameExists(username: string): boolean {
  username = username.trim().toLowerCase();
  if (getSeedProfile(username)) return true;
  if (isBrowser() && localStorage.getItem(profileKey(username))) return true;
  return false;
}
