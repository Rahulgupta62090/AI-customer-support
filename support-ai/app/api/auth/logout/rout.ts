import { getScaleKit  } from "@/app/lib/scalekit";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    cookieStore.delete("access_token");
    
    const origin = req.nextUrl.origin || "http://localhost:3000";
    return NextResponse.redirect(new URL("/", origin));

  } catch (error) {
    console.error("Logout runtime catch:", error);
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
}