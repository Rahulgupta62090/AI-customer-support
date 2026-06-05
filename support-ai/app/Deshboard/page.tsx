import { redirect } from "next/navigation";
import HomeClient from "../components/HomeClient";
import { getSession } from "@/app/lib/getSession";

export default async function DeshboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const email = (session as { user?: { email?: string } })?.user?.email ?? "";

  // You can replace this with your real dashboard UI.
  return <HomeClient email={email} />;
}

