import { getScaleKit } from "@/app/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

function getAppRedirectUrl(req: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Fallback below
    }
  }

  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const redirectUri = new URL("/api/auth/callback", req.url).toString();

  if (!code) {
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("error", encodeURIComponent("The login callback did not receive an auth code."));
    return NextResponse.redirect(errorUrl);
  }

  try {
    const scalekit = getScaleKit();
    const session = await scalekit.authenticateWithCode(code, redirectUri);

    const response = NextResponse.redirect(getAppRedirectUrl(req));
    
    // Ensure expiresIn is treated as a valid number, default to 1 hour (3600s)
    const tokenExpiryInSeconds = Number(session.expiresIn) || 3600;
    
    // Subtract 60 seconds for a safe buffer, ensuring it never drops below a 5-minute minimum session
    const safeMaxAge = Math.max(tokenExpiryInSeconds - 60, 300); 
    const expiresAtSeconds = Math.floor(Date.now() / 1000) + safeMaxAge;

    // Use lax for OAuth callbacks to prevent browser dropping the cookie on cross-site redirects
    response.cookies.set("access_token", session.accessToken, {
      httpOnly: true,
      maxAge: safeMaxAge,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax", 
    });

    response.cookies.set("access_token_expires_at", String(expiresAtSeconds), {
      httpOnly: true, // Consider setting this to false ONLY if your client-side JS needs to read it
      maxAge: safeMaxAge,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax", 
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("error", encodeURIComponent(message));
    return NextResponse.redirect(errorUrl);
  }
}