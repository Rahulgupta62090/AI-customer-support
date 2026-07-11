import { redirect } from "next/navigation";
import DashboardClient from "../components/DashboardClient";
import { getSession } from "@/app/lib/getSession";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }


  const email = (session as { user?: { email?: string } })?.user?.email ?? "";

  return <DashboardClient ownerId={email} />;
}


