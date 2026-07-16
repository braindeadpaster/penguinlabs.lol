"use client";

import { useEffect, useRef, useState } from "react";

// A soft trailing dot cursor. Disabled on touch / coarse pointers so mobile is
// unaffected (the ring would just sit uselessly under a finger).
export default function CustomCursor({ accent }: { accent: string }) {
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${pos.x - 12}px, ${pos.y - 12}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ring}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-6 w-6 rounded-full mix-blend-difference"
      style={{ border: `1.5px solid ${accent}` }}
      aria-hidden
    />
  );
}
