import { describe, test, expect, vi, beforeEach } from "vitest";
import { EditorView } from "@codemirror/view";
import { insertContent } from "../insert-content";

// 模拟 CodeMirror 的 EditorView
class MockEditorView {
  state = {
    selection: {
      ranges: [{ from: 0, to: 0 }],
    },
    sliceDoc: vi.fn(() => "selected text"), //始终返回长度为13的字符串
    doc: { toString: () => "" },
  };

  focus = vi.fn();
  dispatch = vi.fn();
}

// 模拟 undo/redo 命令
vi.mock("@codemirror/commands", () => ({
  undo: vi.fn(),
  redo: vi.fn(),
}));

describe("InsertContent Utils测试", () => {
  let mockView: any;

  beforeEach(() => {
    mockView = new MockEditorView();
    insertContent.setEditorView(mockView as unknown as EditorView);
  });

  test("设置编辑器视图", () => {
    insertContent.setEditorView(null);
    expect(insertContent["editorView"]).toBeNull();
  });

  describe("插入内容", () => {
    test("无选中文本时插入内容", () => {
      mockView.state.selection.ranges[0] = { from: 0, to: 0 };

      insertContent.insertContent("new content", { anchor: 0, head: 0 });

      expect(mockView.dispatch).toHaveBeenCalledWith({
        changes: { from: 0, to: 0, insert: "new content" },
        selection: { anchor: 0, head: 0 },
      });
    });

    test("替换选中文本并调整光标", () => {
      mockView.state.selection.ranges[0] = { from: 5, to: 10 };

      insertContent.insertContent("**", { anchor: 2, head: 2 });

      expect(mockView.state.sliceDoc).toHaveBeenCalledWith(5, 10);
      expect(mockView.dispatch).toHaveBeenCalledWith({
        changes: {
          from: 5,
          to: 10,
          insert: "**selected text",
        },
        selection: {
          anchor: 7, // 5 + 2
          head: 20, // 5+2+13
        },
      });
    });
  });

  describe("光标处插入文本", () => {
    test("在当前位置插入文本", () => {
      mockView.state.selection.ranges[0] = { from: 3, to: 3 };

      insertContent.insertTextAtCursor("hello");

      expect(mockView.dispatch).toHaveBeenCalledWith({
        changes: { from: 3, to: 3, insert: "hello" },
        selection: { anchor: 8, head: 8 }, // 3 + 5
      });
    });
  });

  describe("撤销/重做", () => {
    test("触发撤销命令", async () => {
      const { undo } = await import("@codemirror/commands");
      insertContent.undo();
      expect(undo).toHaveBeenCalledWith(mockView);
    });

    test("触发重做命令", async () => {
      const { redo } = await import("@codemirror/commands");
      insertContent.redo();
      expect(redo).toHaveBeenCalledWith(mockView);
    });

    test("无编辑器视图时安全处理", async () => {
      insertContent.setEditorView(null);
      expect(() => insertContent.undo()).not.toThrow();
      expect(() => insertContent.redo()).not.toThrow();
    });
  });

  test("未设置编辑器视图时安全处理", () => {
    insertContent.setEditorView(null);
    expect(() => insertContent.insertContent("test", { anchor: 0, head: 0 })).not.toThrow();
    expect(() => insertContent.insertTextAtCursor("test")).not.toThrow();
  });
});
