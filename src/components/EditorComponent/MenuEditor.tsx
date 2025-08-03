import type { Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import { Bold, Heading1Icon, Heading2Icon, Heading3Icon, Italic, Strikethrough } from "lucide-react"

interface MenuEditorType {
    editor: Editor | null
}

const MenuEditor = ({ editor }: MenuEditorType) => {
    if (!editor) {
        return null
    }
    // Todo: Background not working
    return (
        <div>
            <Toggle
                pressed={editor?.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="data-[state=on]:bg-muted data-[state=on]:text-primary"
            >
                <Heading3Icon />
            </Toggle>
        </div>
    )
}

export default MenuEditor