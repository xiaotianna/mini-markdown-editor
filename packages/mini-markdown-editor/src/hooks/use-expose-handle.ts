import { useEditorContentStore } from "@/store/editor";
import { EditorRef } from "@/types/ref";
import { insertContent } from "@/utils/insert-content";
import { EditorView } from "@uiw/react-codemirror";
import { useImperativeHandle, ForwardedRef } from "react";

class ExposeHandle {
  private view: EditorView | null = null;
  constructor(view: EditorView | null) {
    if (!view) return;
    this.view = view;
  }
  // 设置内容
  public setContent(content: string) {
    if (!this.view) return;
    this.view.focus();
    const selection = {
      anchor: content.length,
      head: content.length,
    };
    insertContent.insertContent(content, selection);
  }
  // 获取内容
  public getContent() {
    if (!this.view) return "";
    return this.view.state.doc.toString();
  }
  // 清空内容
  public clear() {
    if (!this.view) return;
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: "",
      },
    });
  }
  // 设置光标位置
  public setCursor(start: number, end: number) {
    if (!this.view) return;
    if (start < end) {
      new Error("start 必须比 end 大");
      return;
    }
    // 获取光标位置
    const { from, to } = this.view.state.selection.ranges[0];
    if (from < start || to < end) {
      start = from;
      end = to;
    }
    this.view.dispatch({
      selection: {
        anchor: start,
        head: end,
      },
    });
    this.view.focus();
  }
  // 获取光标位置
  public getCursor() {
    if (!this.view)
      return {
        from: 0,
        to: 0,
      };
    const { from, to } = this.view.state.selection.ranges[0];
    return { from, to };
  }
  // 获取选中内容
  public getSelection() {
    if (!this.view) return "";
    const range = this.view.state.selection.main;
    return this.view.state.sliceDoc(range.from, range.to);
  }
  // 聚焦
  public focus() {
    if (!this.view) return;
    this.view.focus();
  }
}

// 向外部暴露方法，通过ref获取方法
export const useExposeHandle = (ref: ForwardedRef<EditorRef>) => {
  const { editorView, previewView } = useEditorContentStore();
  const exposeFn = new ExposeHandle(editorView);
  useImperativeHandle(ref, () => ({
    setContent: (content: string) => exposeFn.setContent(content),
    getContent: () => exposeFn.getContent(),
    clear: () => exposeFn.clear(),
    setCursor: (start: number, end: number) => exposeFn.setCursor(start, end),
    getCursor: () => exposeFn.getCursor(),
    getSelection: () => exposeFn.getSelection(),
    focus: () => exposeFn.focus(),
    getEditorInstance: () => editorView,
    getPreviewInstance: () => previewView,
  }));
};
