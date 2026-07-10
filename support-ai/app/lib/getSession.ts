import { cookies } from "next/headers";
import { getScaleKit } from "./scalekit";

function isTokenExpired(expiresAtValue?: string) {
  if (!expiresAtValue) return false;

  const expiresAt = Number(expiresAtValue);
  if (!Number.isFinite(expiresAt)) return false;

  return expiresAt <= Math.floor(Date.now() / 1000);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const expiresAtValue = cookieStore.get("access_token_expires_at")?.value;

  if (!token) return null;

  if (isTokenExpired(expiresAtValue)) {
    console.warn("getSession skipped validateToken because the stored access token is already expired.");
    return null;
  }

  const scalekit = getScaleKit();

  try {
    const result = await scalekit.validateToken(token);
    // ScaleKit token validation result should contain a `sub` claim (user id)
    const userId = (result as { sub?: string }).sub;
    if (!userId) return null;

    const user = await scalekit.user.getUser(userId);
    return user;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const shouldClear = /exp|expired|expiration|token.*expired|validation|jwt/i.test(msg);

    if (shouldClear) {
      console.warn("getSession validateToken failed (expired/invalid token):", msg);
    } else {
      console.log("getSession validateToken failed:", error);
    }

    return null;
  }
}

