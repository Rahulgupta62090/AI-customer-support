import { redirect } from "next/navigation";
import DeshboardClient from "../components/DeshboardClient";
import { getSession } from "@/app/lib/getSession";

export default async function DeshboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }


  const email = (session as { user?: { email?: string } })?.user?.email ?? "";

  return <DeshboardClient ownerId={email} />;
}


