import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    console.log("Auth callback received:", query);
    return NextResponse.json({ status: "ok", query });
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json(
      {
        error: "Callback handling failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
