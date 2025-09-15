"use server"
import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function checkAdmin() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session){
        return redirect("/login")
    }

    if(session.user.role !== "admin"){
        return redirect("/not-admin")
    }
    return session
}