"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({
  title,
  artist,
  url,
  accent,
  autoPlay,
}: {
  title: string;
  artist: string;
  url: string;
  accent: string;
  autoPlay?: boolean;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = audio.current;
    if (!el || !autoPlay) return;
    el.volume = 0.6;
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [autoPlay]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const onTime = () => {
    const el = audio.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
    setCurrent(el.currentTime);
    setDuration(el.duration);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audio.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * el.duration;
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-[300px] rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
      <audio
        ref={audio}
        src={url}
        loop
        onTimeUpdate={onTime}
        onLoadedMetadata={onTime}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-black transition active:scale-95"
          style={{ background: accent }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-[11px] font-medium text-white/85">{title}</div>
          <div className="truncate font-mono text-[10px] text-white/40">{artist}</div>
        </div>
        <div className="font-mono text-[10px] tabular-nums text-white/40">
          {fmt(current)}/{fmt(duration)}
        </div>
      </div>
      <div
        className="mt-3 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
        onClick={seek}
      >
        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: accent }} />
      </div>
    </div>
  );
}

function fmt(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
