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
          minHeight: "100vh",
          backgroundColor: "#f9fafb", // Matches the off-white background
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff", // Clean white card
            padding: "48px 40px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 12px 0", fontSize: "24px", color: "#111827", fontWeight: 600 }}>
              Welcome to InlineAgent
            </h1>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "15px", lineHeight: "1.5" }}>
              Add an AI-powered chat widget to your website in minutes.
            </p>
          </div>
          
          <Link
            href="/login"
            style={{
              background: "#000000",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "16px",
              display: "inline-block",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Login
          </Link>
        </div>
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