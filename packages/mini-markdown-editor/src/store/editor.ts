import { create } from "zustand";
import code from "@/mock/preview.md?raw";
import type { EditorView } from "@codemirror/view";

interface EditorContentStoreType {
  content: string;
  setContent: (content: string) => void;
  scrollWrapper: string;
  setScrollWrapper: (scrollWrapper: string) => void;
  // 编辑区
  editorView: EditorView | null;
  setEditorView: (view: EditorView | null) => void;
  focusEditor: () => void;
  // 预览区
  previewView: HTMLElement | null;
  setPreviewView: (view: HTMLElement | null) => void;
}

// 编辑器内容状态
const useEditorContentStore = create<EditorContentStoreType>((set, get) => ({
  content: code,
  setContent: (content: string) => set({ content }),
  scrollWrapper: "",
  setScrollWrapper: (scrollWrapper: string) => set({ scrollWrapper }),
  // 编辑区
  editorView: null,
  setEditorView: (view: EditorView | null) => set({ editorView: view }),
  focusEditor: () => {
    const { editorView } = get();
    if (editorView) {
      editorView.focus();
    }
  },
  // 预览区
  previewView: null,
  setPreviewView: (view: HTMLElement | null) => set({ previewView: view }),
}));

export { useEditorContentStore };
