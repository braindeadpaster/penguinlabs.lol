"use client";

import { ReactNode } from "react";

const ACCENT = "#6fa8dc";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/45">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  icon,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {(title || right) && (
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="flex items-center gap-2 text-base font-bold text-white">
                {icon}
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-white/70">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-white/35">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 ${props.className ?? ""}`}
    />
  );
}

export function SaveButton({
  status,
  onClick,
}: {
  status: "idle" | "saving" | "saved" | "error";
  onClick: () => void;
}) {
  const label =
    status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : status === "error" ? "Retry" : "Save changes";
  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      className="rounded-xl px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-60"
      style={{ background: ACCENT }}
    >
      {label}
    </button>
  );
}

export const accent = ACCENT;
