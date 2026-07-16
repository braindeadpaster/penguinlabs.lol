import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AccountSection from "@/components/dashboard/AccountSection";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = (await getSessionUser())!;
  const user = await prisma.user.findUnique({
    where: { username: session.username },
    select: { createdAt: true, usernameChangedAt: true },
  });

  return (
    <AccountSection
      username={session.username}
      createdAt={user?.createdAt.toISOString() ?? null}
      usernameChangedAt={user?.usernameChangedAt?.toISOString() ?? null}
    />
  );
}
