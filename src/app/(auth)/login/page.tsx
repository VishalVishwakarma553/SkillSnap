import { auth } from "@/lib/auth"
import LoginForm from "./_comoponents/LoginForm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"


const LoginPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    // if user already logged in then can't go on login page
    if (session){
        redirect("/")
    }
    return (
        <LoginForm />
    )
}

export default LoginPage