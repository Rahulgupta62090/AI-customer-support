import { getSession } from "../lib/getSession";
import EmbedClient from "../components/embedClient";

async function page() {
    const session = await getSession();
    const ownerId = session?.user?.id;

    if (!ownerId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center">
                <p className="text-sm text-zinc-500">
                    Unable to load the embed page. Please sign in and try again.
                </p>
            </div>
        );
    }

    return <EmbedClient ownerId={ownerId} />;
}
export default page