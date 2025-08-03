"use client"

import { useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuEditor from './MenuEditor'

const DescriptionEditor = () => {
    const editor = useEditor({
    extensions: [StarterKit],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    })
    return (
        <MenuEditor editor={editor} />
    )
}

export default DescriptionEditor