import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./getSession";
import { NodeNextResponse } from "next/dist/server/base-http/node";

export async function proxy(req:NextRequest){
    const session= await getSession()
    if (!session){
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
    }
    return NextResponse.next()
}

export const config ={
    matcher: '/deshboard/:path*',
}