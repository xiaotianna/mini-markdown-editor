import { EditorView } from "@uiw/react-codemirror";

class InsertContent {
  private editorView: EditorView | null = null;

  public setEditorView(view: EditorView | null) {
    this.editorView = view;
  }

  // 插入内容
  public insertContent(content: string, selection: { anchor: number; head: number }) {
    const view = this.editorView;
    if (!view) return;
    // 获取光标
    view.focus();
    const range = view.state.selection.ranges[0];
    const { anchor, head } = selection;

    // 插入指定内容
    view.dispatch({
      changes: {
        from: range.from,
        to: range.to,
        insert: content,
      },
      selection: {
        anchor: range.from + anchor, // 起点（固定点）
        head: range.from + head, // 终点（移动点）
      },
    });
  }
}

const insertContent = new InsertContent();

export { insertContent };
