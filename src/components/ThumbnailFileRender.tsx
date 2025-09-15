import Image from "next/image"
import { Button } from "./ui/button"
import { Loader2, XIcon } from "lucide-react"

export const UploadedThumbnail = ({previewUrl,isDeleting,handleFileRemove}: {previewUrl: string,isDeleting:boolean, handleFileRemove: ()=> void}) => {
    return (
        <div className="">
            <Image 
            src={previewUrl}
            alt="perviewUrl"
            fill
            className="object-contain"
            />
            <Button onClick={handleFileRemove} variant={'outline'} disabled={isDeleting} className="absolute -top-3 right-2">{isDeleting?<Loader2 className="size-4 animate-spin" />:<XIcon className="size-5" />}</Button>
        </div>
    )
}