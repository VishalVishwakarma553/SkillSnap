import { Button } from "@/components/ui/button"
import Link from "next/link"

const CoursePage = () => {
    return (
        <>
            <div className="flex items-center justify-between ">
                <h1 className="text-2xl font-bold">Your Courses</h1>
                <Link href="/admin/courses/create">
                    <Button>Create Course</Button>
                </Link>
            </div>
            <p>All previously created courses will appear here</p>
        </>
    )
}

export default CoursePage
