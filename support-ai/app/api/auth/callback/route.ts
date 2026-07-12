import { getScaleKit } from "@/app/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

function getAppRedirectUrl(req: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
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
    const tokenExpiryInSeconds = session.expiresIn || 3600;
    const safeMaxAge = tokenExpiryInSeconds - 60;
    const expiresAtSeconds = Math.floor(Date.now() / 1000) + (safeMaxAge > 0 ? safeMaxAge : 0);

    response.cookies.set("access_token", session.accessToken, {
      httpOnly: true,
      maxAge: safeMaxAge > 0 ? safeMaxAge : 0,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    response.cookies.set("access_token_expires_at", String(expiresAtSeconds), {
      httpOnly: true,
      maxAge: safeMaxAge > 0 ? safeMaxAge : 0,
      secure:false,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("error", encodeURIComponent(message));
    return NextResponse.redirect(errorUrl);
  }
}