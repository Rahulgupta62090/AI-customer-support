import connectdb from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import SettingsModel from "@/app/model/setting.model";

export async function POST(req: NextRequest) {
  try {
    const { ownerId } = await req.json();

    if (!ownerId) {
      return NextResponse.json({ message: "owner Id is required" }, { status: 400 });
    }

    await connectdb();

    const setting = await SettingsModel.findOne({ ownerId });
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ message: `get settings error ${error}` }, { status: 500 });
  }
}

