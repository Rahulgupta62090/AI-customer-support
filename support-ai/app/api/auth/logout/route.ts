import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Best-effort: avoid throwing if delete isn't supported in this context.
    try {
      cookieStore.delete("access_token");
    } catch (e) {
      console.warn("logout: failed to clear access_token cookie:", e);
    }
    
    const origin = req.nextUrl.origin || "http://localhost:3000";
    return NextResponse.redirect(new URL("/", origin));

  } catch (error) {
    console.error("Logout runtime catch:", error);
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
}