"use server"
import { auth } from "@/lib/auth"
import { ApiResponse } from "@/lib/generalTypes"
import { prisma } from "@/lib/prisma"
import { createCourseSchema } from "@/lib/zodSchema"
import { createCourseResolver } from "@/lib/zodSchema"
import { headers } from "next/headers"
export async function CreateCourse(courseInfo: createCourseResolver):Promise<ApiResponse> {
    try{
        const result = createCourseSchema.safeParse(courseInfo)
        if(!result.success){
            return {
                status:"error",
                message: "invalid input format"
            }
        }
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if(!session){
            return {
            status: "error",
            message:"User is not authenticated"
        }
        }
        await prisma.course.create({
            data: {
                ...result.data,
                userId: session.user.id,   
            },
        })
        return {
            status: "success",
            message:"Course created successfully"
        }
    }catch(error){
        if(error instanceof Error){
            return {
                status:"error",
                message: error.message
            }
        }else{
            return {
                status: "error",
                message: "Something went wrong"
            }
        }
    }
}

export async function testing(Info:createCourseResolver) {
    const result = createCourseSchema.safeParse(Info)
    return result
}