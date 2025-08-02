import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function publicLayout({children}:{children: ReactNode}) {
    return (
        <>
        <Navbar ></Navbar>
        <main className="container mx-auto px-4 sm:px-6 md:px-8">
            {children}
        </main>
        </>
    )
}