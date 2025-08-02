"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowRightIcon, Award, BookOpen, icons, TrendingUp } from "lucide-react";
import Link from "next/link";
import {  useRouter } from "next/navigation";
import { ReactElement } from "react";
import { toast } from "sonner";

interface featureType {
    title: string,
    description:string,
    icon: ReactElement
}

const features:featureType[] = [
    {
        title: "Rich Course Content",
        description: "Access video lectures, interactive quizzes, and downloadable resources",
        icon: <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed progress analytics",
        icon: <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
    },
    {
        title: "Certificates",
        description: "Earn certificates upon course completion to showcase your skills",
        icon:<Award className="h-12 w-12 text-purple-600 mb-4" />
    }
]

export default function Home() {
    const router = useRouter()
    const {
        data: session
    } = authClient.useSession()
    // Logout function
    const Logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // redirect to login page
                    toast.success("Signout Successfully")
                },
            },
        });
    }
    return (
        <>
        <section className="py-20">
            <div className="flex flex-col items-center space-y-8">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Learn Without Limits</h1>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter"><span>SkillSnap </span>A Way To Success</h1>
                </div>
                <p className="max-w-[930px] text-center md:text-xl text-muted-foreground ">Access thousands of courses, track your progress, and achieve your learning goals with our comprehensive learning management system.</p>
                <Link href={"/courses"}><Button>Explore courses and Start Learning <ArrowRightIcon /></Button></Link>
            </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
            {
                features.map((feature, idx) => (
                    <Card key={idx} className="hover:shadow-xl transition-shadow">
                        <CardHeader>
                            {feature.icon}
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {feature.description}
                        </CardContent>
                    </Card>
                ))
            }
        </section>
        </>
    );
}
