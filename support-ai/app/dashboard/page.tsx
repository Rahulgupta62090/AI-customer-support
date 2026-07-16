import { redirect } from "next/navigation";
import DashboardClient from "../components/DashboardClient";
import { getSession } from "@/app/lib/getSession";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  const ownerId = (session as { user?: { id?: string } })?.user?.id ?? "";
  return <DashboardClient ownerId={ownerId} />;
}