import { div } from "motion/react-client";
import { getSession } from "../lib/getSession";
import EmbedClient from "../components/embedClient";

async function page() {
    const session = await getSession()
    return (
        <div>
            <EmbedClient ownerId={session?.user?.id!} />
        </div>
    )
}
export default page