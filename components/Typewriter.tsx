"use client";

import { useEffect, useState } from "react";

// Types each line out, holds, deletes, then moves to the next — the classic
// bio-page tagline effect. Purely cosmetic.
export default function Typewriter({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const safe = lines.length ? lines : [""];
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = safe[lineIdx % safe.length];
    let delay = deleting ? 45 : 75;

    if (!deleting && text === full) {
      delay = 1600; // hold at full line
    } else if (deleting && text === "") {
      setDeleting(false);
      setLineIdx((i) => (i + 1) % safe.length);
      delay = 350;
    }

    const t = setTimeout(() => {
      if (!deleting && text === full) {
        if (safe.length > 1) setDeleting(true);
        return;
      }
      const next = deleting
        ? full.slice(0, Math.max(0, text.length - 1))
        : full.slice(0, text.length + 1);
      setText(next);
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, lineIdx, safe]);

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle" style={{ height: "1em" }} />
    </span>
  );
}
