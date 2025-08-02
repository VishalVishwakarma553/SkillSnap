"use client"
import GoogleIcon from "@/components/GoogleIcon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const LoginForm = () => {
    // useTransition hook just show pending state can also use loading and setLoading
    const [googlePending, googlePendingState] = useTransition()
    const [emailPending, emailPendingState] = useTransition()
    const [signUpUi, setSignUpUi] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    // Sign In with Google
    const signInWithGoogle = async () => {
        googlePendingState(async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed In successfully")
                    },
                    onError: (error) => {
                        console.log(error)
                        toast.error("Internal Server Error")
                    }
                }
            })
        })
    }

    // Sign In with email
    const signInWithEmail = async () => {
        if (!formData.email || !formData.password) {
            toast.error("Please enter email and password")
            return
        }
        emailPendingState(async () => {
            await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    toast.success("SignedIn Successfully")
                },
                onError: ({error}) => {
                    toast.error(error.message)
                }
            })
        })
    }

    // Sign Up with email
    const signUpWithEmail = async () => {
        if (!formData.email || !formData.name || !formData.password){
            toast.error("All fields are required")
            return
        }
        emailPendingState(async () => {
            await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    toast.success("Account created successfully")
                },
                onError: ({error}) => {
                    console.log(error)
                    toast.error(error.message)
                },
            });
        })
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <Card className="max-w-sm">
            <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Please login with google or directly with email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button disabled={googlePending} onClick={signInWithGoogle} className="w-full cursor-pointer" variant={"outline"}>
                    {googlePending ? (<>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Loading...</span>
                    </>) : (<><GoogleIcon /> Login with Google</>)}
                </Button>
                <div className="flex gap-4 items-center text-sm text-muted-foreground">
                    <div className="flex-1 h-px bg-border"></div>
                    <span>Or continue with</span>
                    <div className="flex-1 h-px bg-border"></div>
                </div>
                {
                    signUpUi && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input onChange={onChangeHandler} className="" id="name" name="name" type="name" placeholder="Abhijeet.." />
                        </div>)
                }
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input onChange={onChangeHandler} className="" id="email" type="email" name="email" placeholder="mf@gmail.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input onChange={onChangeHandler} className="" id="password" name="password" type="password" placeholder="......" />
                </div>
                {
                    signUpUi ? (
                        <>
                            <Button onClick={signUpWithEmail} className="w-full cursor-pointer">
                                {emailPending ? <> <Loader2 size={4} className="animate-spin" /> <span>Loading...</span> </> : "Signup"}
                            </Button>
                            <div className="flex items-center">
                                <p className="text-sm text-muted-foreground">Already have an account </p>
                                <Button onClick={() => setSignUpUi(!signUpUi)} className="" variant={"link"}>Login</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button onClick={signInWithEmail} className="w-full cursor-pointer">
                                {emailPending ? <> <Loader2 size={4} className="animate-spin" /> <span>Loading...</span> </> : "Login"}
                            </Button>
                            <div className="flex items-center">
                                <span className="text-sm text-muted-foreground">Don't have an account </span>
                                <Button onClick={() => setSignUpUi(!signUpUi)} className="" variant={"link"}>SignUp</Button>
                            </div>
                        </>
                    )
                }

            </CardContent>
        </Card>
    )
}

export default LoginForm