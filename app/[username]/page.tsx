import Link from "next/link";
import { getPublicProfile } from "@/lib/profile-service";
import ProfileView from "@/components/ProfileView";

export const dynamic = "force-dynamic";

export default async function UserPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username || "");
  const data = await getPublicProfile(username);

  if (!data) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">penguinlabs.lol</div>
        <h1 className="mt-6 text-3xl font-extrabold text-white">@{username.toLowerCase()}</h1>
        <p className="mt-3 text-sm text-white/50">This page hasn&apos;t been claimed yet.</p>
        <Link
          href="/bio"
          className="mt-8 rounded-xl px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
          style={{ background: "#6fa8dc" }}
        >
          Claim @{username.toLowerCase()}
        </Link>
        <Link
          href="/"
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 transition hover:text-white/50"
        >
          ← home
        </Link>
      </main>
    );
  }

  return <ProfileView profile={data.profile} views={data.views} />;
}
