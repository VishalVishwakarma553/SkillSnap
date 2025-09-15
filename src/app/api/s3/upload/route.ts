import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { S3 } from "@/lib/S3Client";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { checkAdmin } from "@/lib/checkAdmin";

const validateUpload = z.object({
    fileName: z.string().min(1, {message:"FileName is required"}),
    contentType: z.string().min(1, {message: "content type is required"}),
    size: z.number().min(1, {message: "size is required"}),
    isImage: z.boolean()
});

export async function POST(request: Request){
    await checkAdmin()
    try{
        const body = await request.json()
        const validationResult = validateUpload.safeParse(body);
        // check body is validated as per validateUpload
        if(!validationResult.success){
            return NextResponse.json({error: "Invalid file request body"},{status: 400})
        }
        const {fileName, contentType, size} = validationResult.data
        const unique_key = `${uuidv4()}-${fileName}`
        const command = new PutObjectCommand({
            Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            ContentType:contentType,
            ContentLength:size,
            Key:unique_key
        })
        const presignedUrl = await getSignedUrl(S3, command, {expiresIn: 360})
        return NextResponse.json({presignedUrl, key:unique_key})
    }catch{
        return NextResponse.json({error: "Failed to generate presigned URL"}, {status: 500})
    }
}