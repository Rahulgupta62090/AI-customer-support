import HomeClient from "./components/HomeClient";
import { getSession } from "@/app/lib/getSession";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          gap: "16px",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1>Welcome to InlineAgent</h1>
        <p>Add an AI-powered chat widget to your website in minutes.</p>
        <Link
          href="/login"
          style={{
            background: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <HomeClient
        email={
          (session as { email?: string })?.email ??
          (session as { user?: { email?: string } }).user?.email ??
          ""
        }
      />
    </>
  );
}