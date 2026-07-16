"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/store";

const ACCENT = "#6fa8dc";

type Item = { label: string; href: string; icon: JSX.Element; soon?: boolean };
type Group = { label: string; items: Item[] };

const I = {
  overview: <PathIcon d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
  analytics: <PathIcon d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke />,
  profile: <PathIcon d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" stroke />,
  links: <PathIcon d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" stroke />,
  media: <PathIcon d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M9 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke />,
  appearance: <PathIcon d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.5 0-1.5 1-2 2.5-2H18a3 3 0 003-3 8 8 0 00-9-8.5z" stroke />,
  connections: <PathIcon d="M9 7V4h6v3M9 17v3h6v-3M4 9h4v6H4zM16 9h4v6h-4z" stroke />,
  embed: <PathIcon d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke />,
  store: <PathIcon d="M4 8h16l-1 12H5zM8 8a4 4 0 018 0" stroke />,
  account: <PathIcon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l1.5 2.6-2 2.6.3 3-3 .9L12 23l-3.8-1.9-3-.9.3-3-2-2.6L5 12l-1.5-2.6 2-2.6-.3-3 3-.9L12 1l3.8 1.9 3 .9-.3 3 2 2.6z" stroke />,
};

const GROUPS: Group[] = [
  {
    label: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: I.overview },
      { label: "Analytics", href: "/dashboard/analytics", icon: I.analytics, soon: true },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Profile", href: "/dashboard/profile", icon: I.profile },
      { label: "Links", href: "/dashboard/links", icon: I.links },
      { label: "Media", href: "/dashboard/media", icon: I.media },
    ],
  },
  {
    label: "Customize",
    items: [
      { label: "Appearance", href: "/dashboard/appearance", icon: I.appearance },
      { label: "Connections", href: "/dashboard/connections", icon: I.connections, soon: true },
      { label: "Embed", href: "/dashboard/embed", icon: I.embed, soon: true },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Store", href: "/dashboard/store", icon: I.store, soon: true },
      { label: "Account", href: "/dashboard/account", icon: I.account },
    ],
  },
];

export default function Sidebar({ username }: { username: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-ink-950/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-white/10 p-2 text-white/70"
          aria-label="Menu"
        >
          <PathIcon d="M4 6h16M4 12h16M4 18h16" stroke />
        </button>
      </div>

      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-60 flex-col border-r border-white/10 bg-ink-950 px-3 py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-2">
          <Brand />
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          {GROUPS.map((g) => (
            <div key={g.label} className="mb-5">
              <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                {g.label}
              </div>
              <div className="flex flex-col gap-0.5">
                {g.items.map((it) => (
                  <NavLink key={it.href} item={it} onNavigate={() => setOpen(false)} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <Footer username={username} />
      </aside>
    </>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/bud.png" alt="" className="h-7 w-7 rounded-full" />
      <span className="font-mono text-sm font-bold tracking-tight text-white">
        penguin<span style={{ color: ACCENT }}>labs</span>
      </span>
    </Link>
  );
}

function NavLink({ item, onNavigate }: { item: Item; onNavigate: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active ? "bg-white/[0.07] text-white" : "text-white/50 hover:bg-white/[0.03] hover:text-white/80"
      }`}
    >
      <span className="text-current" style={active ? { color: ACCENT } : undefined}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.soon && (
        <span className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-white/30 ring-1 ring-white/10">
          soon
        </span>
      )}
    </Link>
  );
}

function Footer({ username }: { username: string }) {
  const router = useRouter();
  const doLogout = async () => {
    await logout();
    router.replace("/bio");
    router.refresh();
  };
  return (
    <div className="border-t border-white/10 pt-3">
      <Link
        href={`/${username}`}
        target="_blank"
        className="mb-3 flex items-center gap-2 px-3 text-xs font-semibold text-white/50 transition hover:text-white/80"
      >
        <PathIcon d="M14 3h7v7M21 3l-9 9M10 5H5v14h14v-5" stroke />
        View bio page
      </Link>
      <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
        <div className="flex items-center gap-2 truncate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bud.png" alt="" className="h-7 w-7 rounded-full" />
          <span className="truncate font-mono text-xs text-white/70">@{username}</span>
        </div>
        <button onClick={doLogout} className="text-white/40 transition hover:text-white/80" aria-label="Log out">
          <PathIcon d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke />
        </button>
      </div>
    </div>
  );
}

function PathIcon({ d, stroke }: { d: string; stroke?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth={stroke ? 1.8 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
