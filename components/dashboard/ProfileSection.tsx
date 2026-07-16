"use client";

import { useState } from "react";
import { Profile } from "@/lib/profiles";
import { saveProfile } from "@/lib/store";
import { PageHeader, Card, Field, Input, Textarea, SaveButton } from "./ui";

const MAX_TAGLINES = 5;

export default function ProfileSection({ initial }: { initial: Profile }) {
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [bio, setBio] = useState(initial.bio);
  const [taglines, setTaglines] = useState<string[]>(initial.taglines.length ? initial.taglines : [""]);
  const [location, setLocation] = useState(initial.location ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setStatus("saving");
    const r = await saveProfile({
      displayName,
      bio,
      taglines: taglines.map((t) => t.trim()).filter(Boolean),
      location,
    });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 1800);
  };

  const setTag = (i: number, v: string) => setTaglines((t) => t.map((x, idx) => (idx === i ? v : x)));
  const addTag = () => taglines.length < MAX_TAGLINES && setTaglines((t) => [...t, ""]);
  const removeTag = (i: number) => setTaglines((t) => t.filter((_, idx) => idx !== i));

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Tell the world who you are."
        right={<SaveButton status={status} onClick={save} />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="All about you" subtitle="Basic info displayed on your page.">
          <div className="flex flex-col gap-4">
            <Field label="Display name" hint="Shown instead of your username. Leave blank to use your username.">
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="your name" />
            </Field>
            <Field label="Bio" hint="Hidden automatically if you use taglines.">
              <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell others about yourself" />
            </Field>
            <Field label="Location">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. South London" />
            </Field>
          </div>
        </Card>

        <Card
          title="Taglines"
          subtitle="Animated text that rotates on your page."
          right={
            <span className="rounded-lg bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-white/50">
              {taglines.filter((t) => t.trim()).length}/{MAX_TAGLINES}
            </span>
          }
        >
          <div className="flex flex-col gap-2">
            {taglines.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={t} onChange={(e) => setTag(i, e.target.value)} placeholder={`tagline ${i + 1}`} />
                <button
                  onClick={() => removeTag(i)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-300"
                  aria-label="Remove tagline"
                >
                  ✕
                </button>
              </div>
            ))}
            {taglines.length < MAX_TAGLINES && (
              <button
                onClick={addTag}
                className="mt-1 rounded-xl border border-dashed border-white/15 px-3 py-2.5 text-sm font-semibold text-white/50 transition hover:border-white/30 hover:text-white/80"
              >
                + Add tagline
              </button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
