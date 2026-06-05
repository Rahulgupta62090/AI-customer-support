import HomeClient from "./components/HomeClient";
import { getSession } from "@/app/lib/getSession";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await getSession()
  if (!session) {
    redirect("/login"); 
  }
  
  return (
    <>
      <HomeClient email={(session as { email?: string } )?.email ?? (session as { user?: { email?: string } }).user?.email ?? ""} />
    </>
  );
 
}
