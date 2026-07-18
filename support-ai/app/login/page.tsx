import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const rawError = params?.error;
  const errorMessage =
    typeof rawError === "string"
      ? rawError
      : Array.isArray(rawError)
        ? rawError[0]
        : undefined;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
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
          <h1 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#111827", fontWeight: 600 }}>
            Welcome Back
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
            Sign in to continue to InlineAgent
          </p>
        </div>

        {params?.reason === "expired" ? (
          <div style={{
            backgroundColor: "#fffbeb",
            color: "#92400e",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #fde68a"
          }}>
            Your session expired. Please log in again.
          </div>
        ) : null}

        {errorMessage ? (
          <div style={{
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #fecaca",
            wordBreak: "break-word"
          }}>
            {decodeURIComponent(errorMessage)}
          </div>
        ) : null}

        <Link
          href="/api/auth/login"
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
          Sign in
        </Link>
      </div>
    </div>
  );
}