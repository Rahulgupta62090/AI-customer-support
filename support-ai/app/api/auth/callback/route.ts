import { getScaleKit } from "@/app/lib/scalekit";
import { Scalekit } from "@scalekit-sdk/node";
import { NextRequest,NextResponse } from "next/server";
 export async function GET(req:NextRequest){
       const {searchParams}=new URL(req.url)
       const code= searchParams.get("code")
       const redirectUri = new URL("/api/auth/callback", req.url).toString();
       if (!code){
        return NextResponse.json({massage:"code is not found"},{status:400})
       }
       const scalekit= getScaleKit()
       const session= await scalekit.authenticateWithCode(code,redirectUri)
       console.log(session) 

       const response= NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
       response.cookies.set("access_token", session.accessToken,{
        httpOnly:true,
        maxAge:24*60*60*1000,
        secure:false,
        path:"/"
       })
       return response
 }