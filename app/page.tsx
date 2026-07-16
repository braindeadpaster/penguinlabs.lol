import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

const ACCENT = "#6fa8dc";

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <ParticleBackground style="grid" accent={ACCENT} />

      {/* nav */}
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white/80">
          penguin<span style={{ color: ACCENT }}>labs</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/penguin"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 transition hover:text-white/80"
          >
            Demo
          </Link>
          <Link
            href="/bio"
            className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-black transition hover:opacity-90"
            style={{ background: ACCENT }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-16 text-center sm:pt-32">
        <div
          className="mb-6 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] tracking-wide text-white/50"
        >
          one link · everything you are
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Your whole world,
          <br />
          <span style={{ color: ACCENT }}>one clean link.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55">
          Build a minimal, fast bio page — your links, socials, music and more —
          living at{" "}
          <span className="font-mono text-white/80">penguinlabs.lol/you</span>.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/bio"
            className="rounded-xl px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
            style={{ background: ACCENT }}
          >
            Claim your page
          </Link>
          <Link
            href="/penguin"
            className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/80 transition hover:bg-white/[0.07]"
          >
            See a live demo
          </Link>
        </div>
      </section>

      {/* features */}
      <section className="relative z-10 mx-auto grid max-w-4xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left backdrop-blur-sm"
          >
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
              {f.tag}
            </div>
            <div className="mb-1.5 text-base font-bold text-white">{f.title}</div>
            <p className="text-sm leading-relaxed text-white/50">{f.body}</p>
          </div>
        ))}
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
          penguinlabs.lol · stay low · stack high
        </div>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    tag: "customize",
    title: "Make it yours",
    body: "Avatar, accent color, background effects, taglines and links — tuned live from your dashboard.",
  },
  {
    tag: "effects",
    title: "Actually looks good",
    body: "Enter splash, background music, particles, a typewriter bio and a custom cursor — out of the box.",
  },
  {
    tag: "instant",
    title: "One shareable link",
    body: "Everything you post lives at a single clean URL you can drop anywhere.",
  },
];
