import HomeClient from "./components/HomeClient";
import { getSession } from "@/app/lib/getSession";


export default async function Home() {
  const session=await getSession()
  
  return (
  <>
   <HomeClient email={session?.user?.email!} />;
  </>
  );
 
}
