"use client";

import { useState } from "react";
import { Profile, BackgroundStyle } from "@/lib/profiles";
import { saveProfile } from "@/lib/store";
import { PageHeader, Card, Field, SaveButton } from "./ui";

const SWATCHES = ["#6fa8dc", "#ffffff", "#a78bfa", "#4ade80", "#f472b6", "#fb923c", "#f43f5e", "#22d3ee"];
const BACKGROUNDS: { id: BackgroundStyle; label: string; desc: string }[] = [
  { id: "particles", label: "Particles", desc: "Floating dots" },
  { id: "grid", label: "Grid", desc: "Subtle grid lines" },
  { id: "plain", label: "Plain", desc: "Just the glow" },
];

export default function AppearanceSection({ initial }: { initial: Profile }) {
  const [accent, setAccent] = useState(initial.accent);
  const [background, setBackground] = useState<BackgroundStyle>(initial.background);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setStatus("saving");
    const r = await saveProfile({ accent, background });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <>
      <PageHeader
        title="Appearance"
        subtitle="Colors and background effect for your page."
        right={<SaveButton status={status} onClick={save} />}
      />

      <div className="flex flex-col gap-4">
        <Card title="Accent color" subtitle="Used for highlights, buttons and effects.">
          <div className="flex flex-wrap items-center gap-2.5">
            {SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className="h-9 w-9 rounded-full border-2 transition"
                style={{ background: c, borderColor: accent.toLowerCase() === c ? "#fff" : "rgba(255,255,255,0.15)" }}
                aria-label={c}
              />
            ))}
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-6 w-6 cursor-pointer rounded bg-transparent"
              />
              <span className="font-mono text-xs text-white/60">{accent}</span>
            </label>
          </div>
        </Card>

        <Card title="Background effect" subtitle="Layered over any uploaded background media.">
          <div className="grid gap-3 sm:grid-cols-3">
            {BACKGROUNDS.map((b) => (
              <button
                key={b.id}
                onClick={() => setBackground(b.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  background === b.id
                    ? "border-white/40 bg-white/[0.06]"
                    : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                }`}
              >
                <div className="text-sm font-bold text-white">{b.label}</div>
                <div className="mt-0.5 text-xs text-white/40">{b.desc}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
