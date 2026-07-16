import { getSessionUser } from "@/lib/auth";
import { getOwnProfile } from "@/lib/profile-service";
import { emptyProfile } from "@/lib/profiles";
import ProfileSection from "@/components/dashboard/ProfileSection";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = (await getSessionUser())!;
  const profile = (await getOwnProfile(session.username)) ?? emptyProfile(session.username);
  return <ProfileSection initial={profile} />;
}
