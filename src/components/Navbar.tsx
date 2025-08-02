"use client"
import Link from "next/link"
import { ThemeToggle } from "./ui/theme-toggle"
import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"
import UserDropDown from "./UserDropDown"

const DesktopNav = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/course" },
    { name: "Dashboard", link: "/admin" }
]

const Navbar = () => {
    
    const { data: session, isPending } = authClient.useSession()
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
            <div className="min-h-16 flex justify-between items-center container mx-auto px-4 sm:px-6 lg:px-8">
                <Link href={"/"}><span className="text-xl">SkillSnap</span></Link>
                <nav className="hodden sm:flex items-center space-x-4">
                    {
                        DesktopNav.map((item) => (
                            <Link
                                href={item.link}
                                key={item.name}
                                className="hover:underline hover:text-primary text-sm font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))
                    }
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {
                        isPending ? null : (session ? <UserDropDown name={session.user.name} email={session.user.email} image={session.user.image || ""} /> : <Link href={"/login"}><Button variant={"secondary"}>LogIn</Button></Link>)
                    }
                </div>
            </div>
        </header>
    )
}

export default Navbar