import { useEffect } from "react";
import { useEditorContentStore } from "@/store/editor";
import { insertContent } from "@/utils/insert-content";

// 同步 editorView
export const useSyncEditorView = () => {
  const editorView = useEditorContentStore((state) => state.editorView);

  useEffect(() => {
    // 为 insertContent 存储实例
    insertContent.setEditorView(editorView);
  });
};
