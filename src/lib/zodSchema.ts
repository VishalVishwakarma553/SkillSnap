import {z} from "zod"

export const courseLevel = ["Begginer", "Intermediate", "Advance"] as const
export const courseCategory = ["AI & ML", "Web Development", "Android Development", "Game Development", "Businnes", "Finance"] as const

export const createCourseSchema = z.object({
    title: z.string().min(2, {message: "Title must be required "}).max(200),
    description: z.string().min(3, {message: "Description must be required"}),
    fileKey: z.string().min(1, {message: "File is required"}),
    price: z.number().min(1, {message: "Price is required"}), //The input from form submission will be string it will convert in number
    duration: z.number().min(0.1, {message: "Course duration should be provided"}),
    level: z.enum(courseLevel),
    category: z.enum(courseCategory, {message: "Category is required"}),
    smallDescription: z.string().min(2, {message: "Description is required"}),
    slug: z.string().min(1, {message: "slug is required"})
})

export type createCourseResolver = z.infer<typeof createCourseSchema>