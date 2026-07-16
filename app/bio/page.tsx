import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default async function BioPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return <AuthForm />;
}
