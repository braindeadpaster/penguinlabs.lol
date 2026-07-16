import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session) redirect("/bio");

  return (
    <div className="min-h-[100dvh] lg:pl-60">
      <Sidebar username={session.username} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
