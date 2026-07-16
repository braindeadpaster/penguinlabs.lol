"use client";

import { useMemo } from "react";
import { BackgroundStyle } from "@/lib/profiles";

export default function ParticleBackground({
  style,
  accent,
}: {
  style: BackgroundStyle;
  accent: string;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2.4 + 1,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 12,
        opacity: Math.random() * 0.35 + 0.08,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* soft accent glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[10px]"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(accent, 0.1)} 0%, transparent 70%)`,
        }}
      />

      {style === "grid" && (
        <div
          className="absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage: `linear-gradient(${hexToRgba(
              "#ffffff",
              0.03
            )} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(
              "#ffffff",
              0.03
            )} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at 50% 40%, black 0%, transparent 78%)",
          }}
        />
      )}

      {style === "particles" &&
        particles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: hexToRgba(accent, p.opacity + 0.2),
              animation: `pl-float ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
