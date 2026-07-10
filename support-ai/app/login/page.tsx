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
        height: "100vh",
        fontFamily: "sans-serif",
        gap: "12px",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <h1>Login to InlineAgent</h1>
      <p>Your session expired. Please log in again.</p>
      {errorMessage ? (
        <p style={{ color: "#b91c1c", maxWidth: "420px" }}>
          {decodeURIComponent(errorMessage)}
        </p>
      ) : null}
      <Link
        href="/api/auth/login"
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Sign in
      </Link>
    </div>
  );
}