import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getOwnProfile } from "@/lib/profile-service";
import { emptyProfile } from "@/lib/profiles";
import DashboardEditor from "@/components/DashboardEditor";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/bio");

  const profile = (await getOwnProfile(session.username)) ?? emptyProfile(session.username);
  return <DashboardEditor initialProfile={profile} />;
}
