import { create } from "zustand";
import type { EditorView } from "@codemirror/view";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { safeLocalStorage } from "@/utils/storage";
import { EDITOR_CONTENT_KEY } from "@/common";

interface EditorContentStoreType {
  content: string;
  setContent: (content: string) => void;
  scrollWrapper: string;
  setScrollWrapper: (scrollWrapper: string) => void;
  // 编辑区
  editorView: EditorView | null;
  setEditorView: (view: EditorView | null) => void;
  editorRef: React.RefObject<ReactCodeMirrorRef> | null;
  setEditorRef: (ref: React.RefObject<ReactCodeMirrorRef>) => void;
  focusEditor: () => void;
  // 预览区
  previewView: HTMLElement | null;
  setPreviewView: (view: HTMLElement | null) => void;
}

const localStorage = safeLocalStorage();

// 编辑器内容状态
const useEditorContentStore = create<EditorContentStoreType>((set, get) => ({
  // content: code,
  content: localStorage.getItem(EDITOR_CONTENT_KEY) || "",
  setContent: (content: string) => set({ content }),
  scrollWrapper: "",
  setScrollWrapper: (scrollWrapper: string) => set({ scrollWrapper }),
  // 编辑区
  editorView: null,
  setEditorView: (view: EditorView | null) => set({ editorView: view }),
  editorRef: null,
  setEditorRef: (ref: React.RefObject<ReactCodeMirrorRef>) => set({ editorRef: ref }),
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
