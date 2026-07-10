import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/getSession";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // This route is ONLY for verifying session validation.
  // It must never throw due to cookie deletion.
  try {
    const session = await getSession();
    return NextResponse.json({ valid: !!session });
  } catch (e) {
    // Safety: any unexpected error should not crash the endpoint.
    return NextResponse.json(
      { valid: false, error: e instanceof Error ? e.message : String(e) },
      { status: 200 }
    );
  }
}

