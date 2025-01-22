import { create } from 'zustand'

interface EditorContentStoreType {
  content: string
  setContent: (content: string) => void
}

// 编辑器内容状态
const useEditorContentStore = create<EditorContentStoreType>((set) => ({
  content: '',
  setContent: (content: string) => set({ content }),
}))

export {
    useEditorContentStore
}
