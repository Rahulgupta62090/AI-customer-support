import { Scalekit } from "@scalekit-sdk/node";
import {cookies} from "next/headers";
import { getScaleKit } from "./scalekit";

export async function getSession(){
    const session= await cookies()
    const token = session.get ("access_token")?.value
    const scalekit=getScaleKit()
    if (!token){
        return null
    }
    try {
        const result = await scalekit.validateToken(token)
        // ScaleKit token validation result should contain a `sub` claim (user id)
        const userId = (result as { sub: string }).sub
        const user = await scalekit.user.getUser(userId)
        return user
    } catch (error) {
        console.log(error)
    }
    
   
}