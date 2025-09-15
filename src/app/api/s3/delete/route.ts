import { checkAdmin } from "@/lib/checkAdmin"
import { S3 } from "@/lib/S3Client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
    // TODO --> CHECK ADMIN REDIRECT NOT WORKING PROPERLY
    await checkAdmin()
    try{
        const body = await request.json()
        const {key} = body
        if(!key){
            return NextResponse.json({error: "Failed to delete(Missing object key)"},{status: 400})
        }
        const command = new DeleteObjectCommand({Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME, Key:key})
        await S3.send(command)
        return NextResponse.json({message:"File deleted successfully", status:200})
    }catch(error){
        return NextResponse.json({error: "Internal server error", status:500})
    }
}