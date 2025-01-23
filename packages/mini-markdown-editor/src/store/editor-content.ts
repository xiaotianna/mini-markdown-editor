import { create } from 'zustand'
import code from '@/mock/preview.md?raw'

interface EditorContentStoreType {
  content: string
  setContent: (content: string) => void
  scrollWrapper: string
  setScrollWrapper: (scrollWrapper: string) => void
}

// 编辑器内容状态
const useEditorContentStore = create<EditorContentStoreType>((set) => ({
  content: code,
  setContent: (content: string) => set({ content }),
  scrollWrapper: '',
  setScrollWrapper: (scrollWrapper: string) => set({ scrollWrapper })
}))

export { useEditorContentStore }
