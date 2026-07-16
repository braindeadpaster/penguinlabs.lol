"use client";

import { useState } from "react";
import { Profile, SocialKind, SOCIAL_KINDS, SocialLink, CustomLink } from "@/lib/profiles";
import { SOCIAL_LABEL } from "@/components/Icons";
import { saveProfile } from "@/lib/store";
import { PageHeader, Card, Input, SaveButton } from "./ui";

export default function LinksSection({ initial }: { initial: Profile }) {
  const [socials, setSocials] = useState<SocialLink[]>(initial.socials);
  const [links, setLinks] = useState<CustomLink[]>(initial.links);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const save = async () => {
    setStatus("saving");
    const r = await saveProfile({
      socials: socials.filter((s) => s.url.trim()),
      links: links.filter((l) => l.label.trim() && l.url.trim()),
    });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 1800);
  };

  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    setLinks((arr) => {
      const next = [...arr];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  return (
    <>
      <PageHeader
        title="Links"
        subtitle="Your socials and custom links, in the order they appear."
        right={<SaveButton status={status} onClick={save} />}
      />

      <div className="flex flex-col gap-4">
        <Card
          title="Socials"
          subtitle="Icon buttons on your page."
          right={
            <button
              onClick={() => setSocials((s) => [...s, { kind: "discord", url: "" }])}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06]"
            >
              + Add social
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {socials.length === 0 && <Empty text="No socials yet." />}
            {socials.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={s.kind}
                  onChange={(e) =>
                    setSocials((arr) => arr.map((x, idx) => (idx === i ? { ...x, kind: e.target.value as SocialKind } : x)))
                  }
                  className="rounded-xl border border-white/10 bg-black/30 px-2 py-3 text-sm text-white outline-none focus:border-white/30"
                >
                  {SOCIAL_KINDS.map((k) => (
                    <option key={k} value={k} className="bg-ink-900">
                      {SOCIAL_LABEL[k]}
                    </option>
                  ))}
                </select>
                <Input
                  value={s.url}
                  onChange={(e) => setSocials((arr) => arr.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))}
                  placeholder="https://..."
                />
                <RemoveBtn onClick={() => setSocials((arr) => arr.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Custom links"
          subtitle="Drag to reorder."
          right={
            <button
              onClick={() => setLinks((l) => [...l, { id: makeId(), label: "", url: "" }])}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06]"
            >
              + Add link
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {links.length === 0 && <Empty text="No links yet." />}
            {links.map((l, i) => (
              <div
                key={l.id}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className={`flex items-center gap-2 rounded-xl border p-1.5 transition ${
                  dragIdx === i ? "border-white/30 bg-white/[0.04]" : "border-transparent"
                }`}
              >
                <span className="cursor-grab px-1 text-white/25" title="Drag to reorder">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                  </svg>
                </span>
                <Input
                  value={l.label}
                  onChange={(e) => setLinks((arr) => arr.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                  placeholder="Label"
                  className="max-w-[38%]"
                />
                <Input
                  value={l.url}
                  onChange={(e) => setLinks((arr) => arr.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))}
                  placeholder="https://..."
                />
                <RemoveBtn onClick={() => setLinks((arr) => arr.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-300"
      aria-label="Remove"
    >
      ✕
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-white/10 py-6 text-center text-sm text-white/30">{text}</div>;
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}
