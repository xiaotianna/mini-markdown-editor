import { createContext, useContext } from "react";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import type { EditorView } from "@codemirror/view";
import type { StoreApi } from "zustand";

interface EditorContentStoreType {
  content: string;
  setContent: (content: string) => void;
  scrollWrapper: string;
  setScrollWrapper: (scrollWrapper: string) => void;
  // 编辑区
  editorView: EditorView | null;
  setEditorView: (view: EditorView | null) => void;
  // 预览区
  previewView: HTMLElement | null;
  setPreviewView: (view: HTMLElement | null) => void;
}

const createEditorContentState = (
  set: (partial: Partial<EditorContentStoreType>) => void,
): EditorContentStoreType => ({
  content: "",
  setContent: (content: string) => set({ content }),
  scrollWrapper: "",
  setScrollWrapper: (scrollWrapper: string) => set({ scrollWrapper }),
  // 编辑区
  editorView: null,
  setEditorView: (view: EditorView | null) => set({ editorView: view }),
  // 预览区
  previewView: null,
  setPreviewView: (view: HTMLElement | null) => set({ previewView: view }),
});

export const createEditorContentStore = () =>
  createStore<EditorContentStoreType>((set) => createEditorContentState(set));

const defaultEditorContentStore = createEditorContentStore();
const EditorContentStoreContext = createContext<StoreApi<EditorContentStoreType> | null>(null);

type Selector<T> = (state: EditorContentStoreType) => T;
const identitySelector = (state: EditorContentStoreType) => state;

const useEditorContentStore = <T = EditorContentStoreType>(selector?: Selector<T>): T => {
  const contextStore = useContext(EditorContentStoreContext);
  const store = contextStore ?? defaultEditorContentStore;
  return useStore(store, (selector ?? (identitySelector as Selector<T>)) as Selector<T>);
};

export { EditorContentStoreContext, useEditorContentStore };
export type { EditorContentStoreType };
