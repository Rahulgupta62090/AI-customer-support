import { getScaleKit } from "@/app/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const redirectUri = new URL("/api/auth/callback", req.url).toString();
    const scalekit = getScaleKit();
    const url = await scalekit.getAuthorizationUrl(redirectUri);

    console.log("ScaleKit auth redirect URL:", url);

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Auth login error:", error);
    const message = error instanceof Error ? error.message : String(error);
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("error", encodeURIComponent(message));
    return NextResponse.redirect(errorUrl);
  }
}