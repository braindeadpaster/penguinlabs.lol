import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/dashboard/ui";
import CopyLink from "@/components/dashboard/CopyLink";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const session = (await getSessionUser())!;
  const user = await prisma.user.findUnique({
    where: { username: session.username },
    select: { createdAt: true, profile: { select: { views: true } } },
  });

  const joined = user?.createdAt
    ? user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";
  const views = user?.profile?.views ?? 0;
  const url = `https://penguinlabs.lol/${session.username}`;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${session.username}`}
        subtitle="Here's what's happening with your bio page."
        right={<CopyLink url={url} label={`penguinlabs.lol/${session.username}`} />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="Joined" value={joined} />
        <Stat label="Total views" value={views.toLocaleString()} />
        <Stat label="Username" value={`@${session.username}`} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card title="Your bio page" subtitle="Share this link anywhere.">
          <div className="flex flex-wrap items-center gap-3">
            <code className="rounded-lg bg-black/30 px-3 py-2 font-mono text-sm text-white/80">
              penguinlabs.lol/{session.username}
            </code>
            <Link
              href={`/${session.username}`}
              target="_blank"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
            >
              Open ↗
            </Link>
          </div>
        </Card>

        <Card title="Get set up" subtitle="Finish your page in a minute.">
          <div className="flex flex-col gap-2 text-sm">
            <Step href="/dashboard/profile" text="Add your name, bio and taglines" />
            <Step href="/dashboard/media" text="Upload an avatar, background and music" />
            <Step href="/dashboard/links" text="Add your socials and links" />
            <Step href="/dashboard/appearance" text="Pick your accent and background" />
          </div>
        </Card>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}

function Step({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-white/60 transition hover:text-white">
      <span style={{ color: "#6fa8dc" }}>→</span>
      {text}
    </Link>
  );
}
