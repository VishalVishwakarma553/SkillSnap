import {z} from "zod"

export const courseLevel = ["Begginer", "Intermediate", "Advance"]
export const courseStatus = ["Public", "Private", "Draft"]
export const courseCategory = ["AI & ML", "Web Development", "Android Development", "Game Development", "Businnes", "Finance"]

export const createCourseSchema = z.object({
    title: z.string().min(2, {message: "Title must be required "}).max(200),
    description: z.string().min(3, {message: "Description must be required"}),
    fileKey: z.string().min(1, {message: "File is required"}),
    price: z.number(), //The input from form submission will be string it will convert in number
    duration: z.number().min(0.1, {message: "Course duration should be provided"}),
    level: z.enum(courseLevel),
    category: z.enum(courseCategory, {message: "Category is required"}),
    smallDescription: z.string().min(2, {message: "Description is required"}),
    status: z.enum(courseStatus),
    slug: z.string().min(1, {message: "slug is required"})
})

export type createCourseResolver = z.infer<typeof createCourseSchema>