"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeUsername, logout } from "@/lib/store";
import { PageHeader, Card, Field, Input } from "./ui";

const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

export default function AccountSection({
  username,
  createdAt,
  usernameChangedAt,
}: {
  username: string;
  createdAt: string | null;
  usernameChangedAt: string | null;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(username);
  const [next, setNext] = useState("");
  const [changedAt, setChangedAt] = useState<string | null>(usernameChangedAt);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const lockedUntil = changedAt ? new Date(changedAt).getTime() + COOLDOWN_MS : 0;
  const now = Date.now();
  const locked = lockedUntil > now;
  const daysLeft = locked ? Math.ceil((lockedUntil - now) / (24 * 60 * 60 * 1000)) : 0;

  const submit = async () => {
    setMsg(null);
    setStatus("saving");
    const r = await changeUsername(next);
    setStatus("idle");
    if (r.ok && r.username) {
      setCurrent(r.username);
      setNext("");
      setChangedAt(new Date().toISOString());
      setMsg({ ok: true, text: `Username changed to @${r.username}` });
      router.refresh();
    } else {
      setMsg({ ok: false, text: r.error || "could not change username" });
    }
  };

  const joined = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <>
      <PageHeader title="Account" subtitle="Manage your account settings." />

      <div className="flex flex-col gap-4">
        <Card title="Account info">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Username" value={`@${current}`} />
            <Info label="Joined" value={joined} />
          </div>
        </Card>

        <Card title="Change username" subtitle="You can change your username once every 14 days.">
          {locked ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
              You can change your username again in <strong>{daysLeft}</strong> day{daysLeft === 1 ? "" : "s"}.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Field label="New username" hint="1–20 characters: a–z, 0–9, underscore.">
                <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-3 focus-within:border-white/30">
                  <span className="font-mono text-sm text-white/30">penguinlabs.lol/</span>
                  <input
                    value={next}
                    onChange={(e) => setNext(e.target.value.toLowerCase())}
                    placeholder="new-name"
                    autoCapitalize="none"
                    spellCheck={false}
                    className="w-full bg-transparent py-3 font-mono text-sm text-white outline-none placeholder:text-white/25"
                  />
                </div>
              </Field>
              <button
                onClick={submit}
                disabled={status === "saving" || !next.trim()}
                className="self-start rounded-xl px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "#6fa8dc" }}
              >
                {status === "saving" ? "Changing…" : "Change username"}
              </button>
            </div>
          )}
          {msg && (
            <div
              className={`mt-3 rounded-lg px-3 py-2 text-xs ${
                msg.ok ? "border border-green-500/20 bg-green-500/10 text-green-300" : "border border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {msg.text}
            </div>
          )}
        </Card>

        <Card title="Session">
          <button
            onClick={async () => {
              await logout();
              router.replace("/bio");
              router.refresh();
            }}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:border-red-500/40 hover:text-red-300"
          >
            Log out
          </button>
        </Card>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-white/35">{label}</div>
      <div className="mt-1 font-mono text-white/80">{value}</div>
    </div>
  );
}
