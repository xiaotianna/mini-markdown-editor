import { EditorView } from "@uiw/react-codemirror";

export interface EditorRef {
  /**
   * 获取编辑器内容
   */
  getContent: () => string;
  /**
   * 设置编辑器内容
   */
  setContent: (content: string) => void;
  /**
   * 清空编辑器内容
   */
  clear: () => void;
  /**
   * 设置光标位置
   */
  setCursor: (start: number, end: number) => void;
  /**
   * 获取光标位置
   */
  getCursor: () => { from: number; to: number };
  /**
   * 获取选中内容
   */
  getSelection: () => string;
  /**
   * 聚焦
   */
  focus: () => void;
  /**
   * 获取编辑器实例
   */
  getEditorInstance: () => EditorView | null;
  /**
   * 获取预览区实例
   */
  getPreviewInstance: () => HTMLElement | null;
}
