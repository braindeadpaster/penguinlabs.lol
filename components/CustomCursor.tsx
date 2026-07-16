"use client";

import { useEffect, useRef, useState } from "react";

// A custom cursor. If `image` is set, the system cursor is hidden and that image
// follows the pointer 1:1. Otherwise a soft accent ring trails the pointer.
// Disabled on touch / coarse pointers so mobile is unaffected.
export default function CustomCursor({ accent, image }: { accent: string; image?: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    if (image) document.body.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (image && dot.current) {
        // image cursor tracks 1:1, no smoothing
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (!image && dot.current) {
        dot.current.style.transform = `translate(${pos.x - 12}px, ${pos.y - 12}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    if (!image) raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, [image]);

  if (!enabled) return null;

  if (image) {
    return (
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[60]" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-8 w-8 select-none object-contain" draggable={false} />
      </div>
    );
  }

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-6 w-6 rounded-full mix-blend-difference"
      style={{ border: `1.5px solid ${accent}` }}
      aria-hidden
    />
  );
}
