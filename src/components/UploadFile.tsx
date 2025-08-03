import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from './ui/card'

const UploadFile = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        console.log(acceptedFiles)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    return (
        <Card {...getRootProps()}
        className={`border-2 border-dashed h-46 transition-colors ease-in-out duration-150 ${isDragActive && "border-primary bg-primary/10 border-solid"}`}
        >
        <CardContent className='flex justify-center items-center h-full'>
            <input {...getInputProps()} />
            
            {
                isDragActive ?
                    <p className='text-primary'>Drop the files here ...</p> :
                    <p className='text-primary font-semibold'>Drag 'n' drop thumbnail here, or click to select files</p>
            }
        </CardContent>
        </Card>
    )
}

export default UploadFile