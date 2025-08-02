"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignout = () => {
    const router = useRouter()
    const signOutHandler = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // redirect to login page
                    toast.success("Signout Successfully")
                },
                onError: ({error}) => {
                    toast.error(error.message)
                }
            },
        });
    }
    return signOutHandler
}