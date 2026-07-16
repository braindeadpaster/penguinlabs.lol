"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Profile,
  SocialKind,
  SOCIAL_KINDS,
  BackgroundStyle,
} from "@/lib/profiles";
import { SOCIAL_LABEL } from "@/components/Icons";
import { saveProfile, logout } from "@/lib/store";
import ProfileView from "@/components/ProfileView";

const ACCENT = "#6fa8dc";
const BACKGROUNDS: BackgroundStyle[] = ["particles", "grid", "plain"];
const ACCENT_SWATCHES = ["#6fa8dc", "#ffffff", "#a78bfa", "#4ade80", "#f472b6", "#fb923c"];

export default function DashboardEditor({ initialProfile }: { initialProfile: Profile }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const save = async () => {
    setStatus("saving");
    const res = await saveProfile(profile);
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setStatus("idle"), 1800);
  };

  const doLogout = async () => {
    await logout();
    router.replace("/bio");
    router.refresh();
  };

  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink-950/80 px-5 py-3 backdrop-blur">
        <div className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white/80">
          penguin<span style={{ color: ACCENT }}>labs</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${profile.username}`}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06]"
          >
            View page ↗
          </Link>
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-lg px-4 py-2 text-xs font-bold text-black transition hover:opacity-90 disabled:opacity-60"
            style={{ background: ACCENT }}
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : status === "error" ? "Retry" : "Save"}
          </button>
          <button
            onClick={doLogout}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/40 transition hover:text-white/70"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1fr_420px]">
        {/* editor */}
        <div className="flex flex-col gap-5">
          <Section title="Identity">
            <Field label="Display name">
              <TextInput value={profile.displayName} onChange={(v) => set("displayName", v)} />
            </Field>
            <Field label="Bio">
              <textarea
                value={profile.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
                placeholder="a line or two about you"
              />
            </Field>
            <Field label="Taglines (one per line, typed out in a loop)">
              <textarea
                value={profile.taglines.join("\n")}
                onChange={(e) =>
                  set("taglines", e.target.value.split("\n").filter((l) => l.length > 0))
                }
                rows={2}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
                placeholder={"stay low · stack high\nmake it yours"}
              />
            </Field>
            <Field label="Location (optional)">
              <TextInput value={profile.location ?? ""} onChange={(v) => set("location", v)} />
            </Field>
            <Field label="Avatar URL">
              <TextInput
                value={profile.avatar}
                onChange={(v) => set("avatar", v)}
                placeholder="/bud.png or https://..."
              />
            </Field>
          </Section>

          <Section title="Look">
            <Field label="Accent color">
              <div className="flex items-center gap-2">
                {ACCENT_SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => set("accent", c)}
                    className="h-8 w-8 rounded-full border transition"
                    style={{
                      background: c,
                      borderColor: profile.accent === c ? "#fff" : "rgba(255,255,255,0.15)",
                    }}
                    aria-label={c}
                  />
                ))}
                <input
                  type="color"
                  value={profile.accent}
                  onChange={(e) => set("accent", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-white/15 bg-transparent"
                />
              </div>
            </Field>
            <Field label="Background">
              <div className="flex gap-2">
                {BACKGROUNDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => set("background", b)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition ${
                      profile.background === b
                        ? "border-white/40 bg-white/[0.06] text-white"
                        : "border-white/10 text-white/50 hover:text-white/80"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Socials">
            <div className="flex flex-col gap-2">
              {profile.socials.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={s.kind}
                    onChange={(e) => {
                      const socials = [...profile.socials];
                      socials[i] = { ...socials[i], kind: e.target.value as SocialKind };
                      set("socials", socials);
                    }}
                    className="rounded-xl border border-white/10 bg-black/20 px-2 py-2.5 text-sm text-white outline-none focus:border-white/30"
                  >
                    {SOCIAL_KINDS.map((k) => (
                      <option key={k} value={k} className="bg-ink-900">
                        {SOCIAL_LABEL[k]}
                      </option>
                    ))}
                  </select>
                  <TextInput
                    value={s.url}
                    onChange={(v) => {
                      const socials = [...profile.socials];
                      socials[i] = { ...socials[i], url: v };
                      set("socials", socials);
                    }}
                    placeholder="https://..."
                  />
                  <RemoveButton
                    onClick={() => set("socials", profile.socials.filter((_, idx) => idx !== i))}
                  />
                </div>
              ))}
            </div>
            <AddButton
              label="Add social"
              onClick={() => set("socials", [...profile.socials, { kind: "discord", url: "" }])}
            />
          </Section>

          <Section title="Links">
            <div className="flex flex-col gap-2">
              {profile.links.map((l, i) => (
                <div key={l.id} className="flex items-center gap-2">
                  <TextInput
                    value={l.label}
                    onChange={(v) => {
                      const links = [...profile.links];
                      links[i] = { ...links[i], label: v };
                      set("links", links);
                    }}
                    placeholder="Label"
                  />
                  <TextInput
                    value={l.url}
                    onChange={(v) => {
                      const links = [...profile.links];
                      links[i] = { ...links[i], url: v };
                      set("links", links);
                    }}
                    placeholder="https://..."
                  />
                  <RemoveButton
                    onClick={() => set("links", profile.links.filter((_, idx) => idx !== i))}
                  />
                </div>
              ))}
            </div>
            <AddButton
              label="Add link"
              onClick={() => set("links", [...profile.links, { id: makeId(), label: "", url: "" }])}
            />
          </Section>

          <Section title="Music (optional)">
            <Field label="Track title">
              <TextInput
                value={profile.music?.title ?? ""}
                onChange={(v) => set("music", { ...normMusic(profile), title: v })}
              />
            </Field>
            <Field label="Artist">
              <TextInput
                value={profile.music?.artist ?? ""}
                onChange={(v) => set("music", { ...normMusic(profile), artist: v })}
              />
            </Field>
            <Field label="Audio URL (mp3)">
              <TextInput
                value={profile.music?.url ?? ""}
                onChange={(v) => set("music", { ...normMusic(profile), url: v })}
                placeholder="https://.../track.mp3"
              />
            </Field>
          </Section>
        </div>

        {/* live preview */}
        <div className="lg:sticky lg:top-[68px] lg:h-[calc(100dvh-88px)]">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Live preview</div>
          <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-950">
            <div className="h-full overflow-y-auto">
              <ProfileView key={previewKey(profile)} profile={profile} preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- small building blocks -------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-white/40">{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
    />
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 self-start rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs font-semibold text-white/50 transition hover:border-white/30 hover:text-white/80"
    >
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-300"
      aria-label="Remove"
    >
      ✕
    </button>
  );
}

function normMusic(p: Profile) {
  return p.music ?? { title: "", artist: "", url: "" };
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function previewKey(p: Profile) {
  return `${p.accent}|${p.background}|${p.taglines.join("~")}|${p.music?.url ?? ""}`;
}
