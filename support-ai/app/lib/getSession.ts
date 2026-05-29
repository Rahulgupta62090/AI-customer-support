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
        const result:any=await scalekit.validateToken(token)
        const user= await scalekit.user.getUser(result.sub)
        return user
    } catch (error) {
        console.log(error)
    }
    
   
}