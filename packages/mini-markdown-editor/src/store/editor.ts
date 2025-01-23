import { create } from "zustand";
import code from "@/mock/preview.md?raw";
import type { EditorView } from "@codemirror/view";

interface EditorContentStoreType {
  content: string;
  setContent: (content: string) => void;
  scrollWrapper: string;
  setScrollWrapper: (scrollWrapper: string) => void;

  editorView: EditorView | null;
  setEditorView: (view: EditorView | null) => void;
  focusEditor: () => void;
}

// 编辑器内容状态
const useEditorContentStore = create<EditorContentStoreType>((set, get) => ({
  content: code,
  setContent: (content: string) => set({ content }),
  scrollWrapper: "",
  setScrollWrapper: (scrollWrapper: string) => set({ scrollWrapper }),

  editorView: null,
  setEditorView: (view: EditorView | null) => set({ editorView: view }),
  focusEditor: () => {
    const { editorView } = get();
    if (editorView) {
      editorView.focus();
    }
  },
}));

export { useEditorContentStore };
