"use client";

import { useState } from "react";

export default function EnterScreen({
  onEnter,
  accent,
}: {
  onEnter: () => void;
  accent: string;
}) {
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    setLeaving(true);
    setTimeout(onEnter, 480);
  };

  return (
    <div
      onClick={enter}
      className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-ink-950/80 backdrop-blur-xl transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-pulse text-center">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: accent }}
        >
          click to enter
        </div>
      </div>
      <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/25">
        penguinlabs.lol
      </div>
    </div>
  );
}
