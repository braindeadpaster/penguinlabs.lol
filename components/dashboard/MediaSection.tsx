"use client";

import { useRef, useState } from "react";
import { Profile, BackgroundType } from "@/lib/profiles";
import { saveProfile, uploadMedia, UploadKind } from "@/lib/store";
import { PageHeader, Card, Field, Input } from "./ui";

export default function MediaSection({ initial }: { initial: Profile }) {
  const [avatar, setAvatar] = useState(initial.avatar);
  const [bgUrl, setBgUrl] = useState(initial.backgroundUrl ?? "");
  const [bgType, setBgType] = useState<BackgroundType>(initial.backgroundType ?? "image");
  const [cursor, setCursor] = useState(initial.cursor ?? "");
  const [music, setMusic] = useState(initial.music ?? { title: "", artist: "", url: "" });

  return (
    <>
      <PageHeader title="Media & uploads" subtitle="Upload and manage your profile media." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Profile avatar" subtitle="Shown at the top of your page.">
          {avatar && avatar !== "/bud.png" ? (
            <Preview onRemove={() => { setAvatar("/bud.png"); saveProfile({ avatar: "/bud.png" }); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
              <span className="text-sm text-white/60">Avatar uploaded</span>
            </Preview>
          ) : null}
          <DropZone
            kind="avatar"
            accept="image/png,image/jpeg,image/gif,image/webp"
            hint="PNG, JPG, GIF or WebP · max 5MB"
            label="Drop avatar here or click to browse"
            onUploaded={(url) => { setAvatar(url); saveProfile({ avatar: url }); }}
          />
        </Card>

        <Card title="Profile background" subtitle="Image or video behind your page.">
          {bgUrl ? (
            <Preview onRemove={() => { setBgUrl(""); saveProfile({ backgroundUrl: "" }); }}>
              {bgType === "video" ? (
                <video src={bgUrl} muted loop autoPlay playsInline className="h-16 w-28 rounded-lg object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bgUrl} alt="" className="h-16 w-28 rounded-lg object-cover" />
              )}
              <span className="text-sm text-white/60">Background uploaded</span>
            </Preview>
          ) : null}
          <DropZone
            kind="background"
            accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm"
            hint="Image or MP4/WebM video · max 30MB"
            label="Drop background here or click to browse"
            onUploaded={(url, isVideo) => {
              setBgUrl(url);
              const t: BackgroundType = isVideo ? "video" : "image";
              setBgType(t);
              saveProfile({ backgroundUrl: url, backgroundType: t });
            }}
          />
        </Card>
      </div>

      <Card title="Background music" subtitle="Plays on your page — visitors can toggle it.">
        {music.url ? (
          <Preview onRemove={() => { setMusic({ title: "", artist: "", url: "" }); saveProfile({ music: null }); }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.05] text-white/60">♪</div>
            <div className="min-w-0">
              <div className="truncate text-sm text-white/70">{music.title || "Audio uploaded"}</div>
              <audio src={music.url} controls className="mt-1 h-8 w-52 max-w-full" />
            </div>
          </Preview>
        ) : null}
        <DropZone
          kind="music"
          accept="audio/mpeg,audio/ogg,audio/wav,audio/mp4,audio/flac,audio/*"
          hint="MP3, OGG, WAV, M4A or FLAC · max 15MB"
          label="Drop audio here or click to browse"
          onUploaded={(url, _isVideo, fileName) => {
            const next = { ...music, url, title: music.title || stripExt(fileName) };
            setMusic(next);
            saveProfile({ music: next });
          }}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Track title">
            <Input
              value={music.title}
              onChange={(e) => setMusic((m) => ({ ...m, title: e.target.value }))}
              onBlur={() => music.url && saveProfile({ music })}
              placeholder="Song name"
            />
          </Field>
          <Field label="Artist">
            <Input
              value={music.artist}
              onChange={(e) => setMusic((m) => ({ ...m, artist: e.target.value }))}
              onBlur={() => music.url && saveProfile({ music })}
              placeholder="Artist name"
            />
          </Field>
        </div>
      </Card>

      <Card title="Custom cursor" subtitle="A small image that replaces the visitor's cursor.">
        {cursor ? (
          <Preview onRemove={() => { setCursor(""); saveProfile({ cursor: "" }); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cursor} alt="" className="h-10 w-10 object-contain" />
            <span className="text-sm text-white/60">Cursor uploaded</span>
          </Preview>
        ) : null}
        <DropZone
          kind="cursor"
          accept="image/png,image/gif,image/webp,image/x-icon"
          hint="PNG, GIF, WebP or ICO · max 1MB"
          label="Drop cursor image here or click to browse"
          onUploaded={(url) => { setCursor(url); saveProfile({ cursor: url }); }}
        />
      </Card>
    </>
  );
}

function DropZone({
  kind,
  accept,
  hint,
  label,
  onUploaded,
}: {
  kind: UploadKind;
  accept: string;
  hint: string;
  label: string;
  onUploaded: (url: string, isVideo: boolean, fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);

  const handle = async (file: File) => {
    setErr("");
    setBusy(true);
    const r = await uploadMedia(kind, file);
    setBusy(false);
    if (r.ok && r.url) onUploaded(r.url, !!r.isVideo, file.name);
    else setErr(r.error || "upload failed");
  };

  return (
    <div className="mt-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handle(f);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed py-8 text-center transition ${
          over ? "border-white/40 bg-white/[0.04]" : "border-white/12 hover:border-white/25 hover:bg-white/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = "";
          }}
        />
        <svg viewBox="0 0 24 24" className="mb-2 h-6 w-6 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
        </svg>
        <div className="text-sm font-medium text-white/70">{busy ? "Uploading…" : label}</div>
        <div className="mt-1 text-[11px] text-white/35">{hint}</div>
      </div>
      {err && <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{err}</div>}
    </div>
  );
}

function Preview({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex min-w-0 items-center gap-3">{children}</div>
      <button
        onClick={onRemove}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-300"
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}

function stripExt(name: string) {
  return name.replace(/\.[^.]+$/, "").slice(0, 80);
}
