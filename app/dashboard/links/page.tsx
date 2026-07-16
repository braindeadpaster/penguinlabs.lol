import { getSessionUser } from "@/lib/auth";
import { getOwnProfile } from "@/lib/profile-service";
import { emptyProfile } from "@/lib/profiles";
import LinksSection from "@/components/dashboard/LinksSection";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const session = (await getSessionUser())!;
  const profile = (await getOwnProfile(session.username)) ?? emptyProfile(session.username);
  return <LinksSection initial={profile} />;
}
