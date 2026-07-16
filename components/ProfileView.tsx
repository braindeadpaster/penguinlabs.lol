"use client";

import { useState } from "react";
import Link from "next/link";
import { Profile } from "@/lib/profiles";
import { SocialIcon } from "./Icons";
import ParticleBackground from "./ParticleBackground";
import CustomCursor from "./CustomCursor";
import Typewriter from "./Typewriter";
import MusicPlayer from "./MusicPlayer";
import EnterScreen from "./EnterScreen";

export default function ProfileView({
  profile,
  preview = false,
  views,
}: {
  profile: Profile;
  preview?: boolean;
  views?: number;
}) {
  const [entered, setEntered] = useState(preview);
  const accent = profile.accent || "#6fa8dc";
  const showViews = !preview && typeof views === "number";

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-10">
      <ParticleBackground style={profile.background} accent={accent} />
      {!preview && <CustomCursor accent={accent} />}
      {!preview && !entered && <EnterScreen accent={accent} onEnter={() => setEntered(true)} />}

      <div
        className={`relative z-10 w-full max-w-[420px] transition-all duration-700 ${
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
          {/* avatar */}
          <div className="mx-auto mb-5 h-24 w-24">
            <div
              className="h-full w-full rounded-full p-[2px]"
              style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar || "/bud.png"}
                alt={profile.displayName}
                className="h-full w-full rounded-full border border-white/10 object-cover"
              />
            </div>
          </div>

          {/* name */}
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {profile.displayName}
          </h1>
          <div className="mt-1 font-mono text-xs text-white/40">
            @{profile.username}
            {profile.location ? ` · ${profile.location}` : ""}
          </div>

          {/* taglines */}
          <div className="mt-3 h-5 font-mono text-[13px]" style={{ color: accent }}>
            <Typewriter lines={profile.taglines} />
          </div>

          {/* bio */}
          {profile.bio && (
            <p className="mt-4 text-sm leading-relaxed text-white/60">{profile.bio}</p>
          )}

          {/* socials */}
          {profile.socials.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {profile.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:-translate-y-0.5 hover:text-white"
                  style={{ transitionProperty: "transform, color, border-color" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  aria-label={s.kind}
                >
                  <SocialIcon kind={s.kind} className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}

          {/* links */}
          {profile.links.length > 0 && (
            <div className="mt-5 flex flex-col gap-2.5">
              {profile.links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.06]"
                >
                  <span>{l.label}</span>
                  <span className="text-white/30 transition group-hover:translate-x-0.5" style={{ color: accent }}>
                    →
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* music */}
          {profile.music?.url && (
            <MusicPlayer
              title={profile.music.title}
              artist={profile.music.artist}
              url={profile.music.url}
              accent={accent}
              autoPlay={entered && !preview}
            />
          )}

          {/* views */}
          {showViews && (
            <div className="mt-6 font-mono text-[11px] text-white/30">
              {views!.toLocaleString()} views
            </div>
          )}
        </div>

        {!preview && (
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 transition hover:text-white/50"
            >
              made with penguinlabs.lol
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
