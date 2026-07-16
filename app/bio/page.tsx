"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, login, currentUser } from "@/lib/store";

const ACCENT = "#6fa8dc";

export default function BioAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser()) router.replace("/dashboard");
  }, [router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = mode === "register" ? register(username, passcode) : login(username, passcode);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(res.error);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center font-mono text-xs uppercase tracking-[0.25em] text-white/40 transition hover:text-white/70"
        >
          penguin<span style={{ color: ACCENT }}>labs</span>.lol
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur-sm">
          {/* tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
            {(["register", "login"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`rounded-lg py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  mode === m ? "text-black" : "text-white/50 hover:text-white/80"
                }`}
                style={mode === m ? { background: ACCENT } : undefined}
              >
                {m === "register" ? "Sign Up" : "Log In"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                Username
              </span>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/20 px-3 focus-within:border-white/30">
                <span className="font-mono text-sm text-white/30">penguinlabs.lol/</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="you"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="w-full bg-transparent py-3 font-mono text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                Passcode
              </span>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
              />
            </label>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 rounded-xl py-3 text-sm font-bold text-black transition hover:opacity-90 active:scale-[0.99]"
              style={{ background: ACCENT }}
            >
              {mode === "register" ? "Create my page" : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-white/30">
          Preview accounts are stored in your browser only — not a real server yet.
          <br />
          Don&apos;t reuse a real password here.
        </p>
      </div>
    </main>
  );
}
