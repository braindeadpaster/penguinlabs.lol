import { getSessionUser } from "@/lib/auth";
import { getOwnProfile } from "@/lib/profile-service";
import { emptyProfile } from "@/lib/profiles";
import MediaSection from "@/components/dashboard/MediaSection";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const session = (await getSessionUser())!;
  const profile = (await getOwnProfile(session.username)) ?? emptyProfile(session.username);
  return <MediaSection initial={profile} />;
}
