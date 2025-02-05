import { EditorView } from "@uiw/react-codemirror";
import { undo, redo } from "@codemirror/commands";

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
    let { anchor, head } = selection;
    if (range.from !== range.to) {
      // 获取选中的内容
      const selectedText = view.state.sliceDoc(range.from, range.to);
      content = content.slice(0, anchor) + selectedText + content.slice(head);
      head = anchor + selectedText.length;
    }

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

  // 模拟输入
  public insertTextAtCursor(content: string) {
    const view = this.editorView;
    if (!view) return;

    view.focus();
    const range = view.state.selection.ranges[0];

    // 插入内容，光标位置在内容末尾
    view.dispatch({
      changes: {
        from: range.from,
        to: range.to,
        insert: content,
      },
      // 将光标移动到插入内容的末尾
      selection: {
        anchor: range.from + content.length,
        head: range.from + content.length,
      },
    });
  }

  // 撤销
  public undo() {
    const view = this.editorView;
    if (!view) return;
    undo(view);
  }
  // 重做
  public redo() {
    const view = this.editorView;
    if (!view) return;
    redo(view);
  }
}

const insertContent = new InsertContent();

export { insertContent };
