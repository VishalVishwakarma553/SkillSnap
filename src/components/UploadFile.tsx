"use client"
import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { UploadedThumbnail } from './ThumbnailFileRender'
import { Button } from './ui/button'

interface UploadingFileState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    s3Bucketkey?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string; //File local url
    fileType: "image" | "video";
}
interface UploadFileProp {
    value ?: string;
    onChange: (value:string) => void
}

const UploadFile = ({onChange, value}:UploadFileProp) => {
    const [fileState, setFileState] = useState<UploadingFileState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        s3Bucketkey:value,
        fileType: "image"
    })

    // Uploading file function
    const Uploading = async (file: File) => {
        // Make the fileState uploading to true
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0
        }))

        // TODO: will use useEffect here latter for removing fileState.objectURL

        try {
            // API call to get presigned url
            const presignedUrlRes = await fetch("/api/s3/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true
                })
            })
            if (!presignedUrlRes.ok) {
                toast.error("Failed to get presigned url")
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true
                }))
                return
            }
            const { presignedUrl, key } = await presignedUrlRes.json()
            // fetch does not show uploading progress so we use xhr(XMLHttpRequest) can also use axios
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100
                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(percentageCompleted)
                        }))
                    }
                }
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            s3Bucketkey: key
                        }))
                        onChange?.(key)
                        resolve() //Type void promise
                        toast.success("File uploaded successfully")
                    } else {
                        reject(new Error("Upload Failed"))
                    }
                }
                xhr.onerror = () => {
                    reject(new Error("Upload Failed"))
                }
                xhr.open("PUT", presignedUrl)
                xhr.setRequestHeader("Content-Type", file.type)
                xhr.send(file)
            })
        } catch (error) {
            toast.error("File upload failed")
            setFileState((prev) => ({
                ...prev,
                progress: 0,
                error: true,
                uploading: false
            }))
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setFileState({
                id: uuidv4(),
                file,
                error: false,
                isDeleting: false,
                progress: 0,
                uploading: false,
                fileType: "image",
                objectUrl: URL.createObjectURL(file)
            })
            Uploading(file)
        }
    }, [])

    const rejectedFiles = (fileRejection: FileRejection[]) => {
        if (fileRejection.length) {
            const multipleFiles = fileRejection.find((rejection) => {
                rejection.errors[0].code === "too-many-files"
            })
            if (multipleFiles) {
                toast.error("Multiple file selected to upload only one allowed")
            }
            const fileSizeExceeds = fileRejection.find((rejection) => {
                rejection.errors[0].code === "file-too-large"
            })
            if (fileSizeExceeds) {
                toast.error("File size is too large")
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, //5 mb conversion in bytes
        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl
    })

    const renderContent = () => {
        if (fileState.uploading) {
            return <h1>Uploading File<span className='ml-1 text-lg font-bold'>{fileState.progress}%</span></h1>
        }
        if (fileState.error) {
            return (
                <div className='space-y-2 flex flex-col justify-center items-center'>
                    <h1 className='text-lg font-bold'>File Upload Failed</h1>
                    <Button>Try Again!</Button>
                </div>
            )
        }
        if (fileState.objectUrl) {
            return <UploadedThumbnail previewUrl={fileState.objectUrl} isDeleting={fileState.isDeleting} handleFileRemove={handleFileRemove} />
        }
        return <p className='text-primary font-semibold'>Drag 'n' drop thumbnail here, or click to select files</p>
    }

    const handleFileRemove = async () => {
        if (!fileState.objectUrl || fileState.isDeleting) {
            return
        }
        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true
            }))
            const res = await fetch("/api/s3/delete", {
                method: "DELETE",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({
                    key: fileState.s3Bucketkey
                })
            })
            if (!res.ok) {
                toast.error("Failed to remove file")
                setFileState((prev) => ({
                    ...prev,
                    isDeleting:false,
                    error:true
                }))
                return
            }
            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")){
                URL.revokeObjectURL(fileState.objectUrl)
            }
            setFileState(() => ({
                file:null,
                uploading: false,
                progress:0,
                objectUrl:undefined,
                error:false,
                fileType:"image",
                id:null,
                isDeleting:false,
                s3Bucketkey:undefined
            }))
            onChange?.("")
            toast.success("File Deleted successfully")
        } catch (error) {
            toast.error("File Deleting Failed")
            setFileState((prev) => ({
                ...prev,
                isDeleting:false,
                error:true
            }))
        }
    }

    return (
        <Card {...getRootProps()}
            className={`border-2 border-dashed h-46 transition-colors ease-in-out duration-150 ${isDragActive && "border-primary bg-primary/10 border-solid"}`}
        >
            <CardContent className='relative flex justify-center items-center h-full'>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p className='text-primary'>Drop the files here ...</p> :
                        renderContent()
                }
            </CardContent>
        </Card>
    )
}

export default UploadFile