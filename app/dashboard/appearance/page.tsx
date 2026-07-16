import { getSessionUser } from "@/lib/auth";
import { getOwnProfile } from "@/lib/profile-service";
import { emptyProfile } from "@/lib/profiles";
import AppearanceSection from "@/components/dashboard/AppearanceSection";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  const session = (await getSessionUser())!;
  const profile = (await getOwnProfile(session.username)) ?? emptyProfile(session.username);
  return <AppearanceSection initial={profile} />;
}
