import connectdb from "@/app/lib/db";
import settingsModel from "../../model/setting.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {ownerId, businessName,supportEmail,knowledge}=await req.json()
        if (!ownerId){
            return NextResponse.json(
        {message:"owner Id is required"},
        {status:400}
           )
        }
        await connectdb()
        const Setting = await settingsModel.findOneAndUpdate(
          { ownerId },
          { ownerId, businessName, supportEmail, knowledge },
          { new: true, upsert: true }
        );
        return NextResponse.json(Setting)
    } catch (error) {
        return NextResponse.json(
            { message: `settings error ${error}` },
            { status: 500 },
        )
    }
}
