import { renderHook } from "@testing-library/react";
import { EditorView } from "@codemirror/view";
import { useEditorContentStore } from "@/store/editor";
import { useExposeHandle } from "../use-expose-handle";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { insertContent } from "@/utils/insert-content";
// 模拟 CodeMirror 的 EditorView 实例
const mockEditorView = {
  state: {
    doc: "test content",
    selection: {
      ranges: [{ from: 0, to: 0 }],
      main: { from: 0, to: 0 },
    },
    sliceDoc: vi.fn(),
  },
  focus: vi.fn(),
  dispatch: vi.fn(),
} as unknown as EditorView;

// 模拟 Zustand 存储
vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(() => ({
    editorView: mockEditorView,
    previewView: {},
  })),
}));

// 模拟插入内容模块
vi.mock("@/utils/insert-content", () => ({
  insertContent: {
    insertContent: vi.fn(),
  },
}));

describe("useExposeHandle Hook测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("应正确暴露所有编辑器操作方法", () => {
    const mockRef = { current: null };
    renderHook(() => useExposeHandle(mockRef as any));

    expect(mockRef.current).toMatchObject({
      setContent: expect.any(Function),
      getContent: expect.any(Function),
      clear: expect.any(Function),
      setCursor: expect.any(Function),
      getCursor: expect.any(Function),
      getSelection: expect.any(Function),
      focus: expect.any(Function),
      getEditorInstance: expect.any(Function),
      getPreviewInstance: expect.any(Function),
    });
  });

  test("setContent 应正确插入内容", () => {
    const mockRef: { current: { setContent: (s: string) => void } | null } = { current: null };
    renderHook(() => useExposeHandle(mockRef as any));

    mockRef.current?.setContent("new content");
    expect(mockEditorView.focus).toHaveBeenCalled();
    expect(vi.mocked(insertContent.insertContent)).toHaveBeenCalledWith(
      "new content",
      { anchor: 11, head: 11 }, // "new content" 长度
    );
  });

  test("getContent 应返回编辑器内容", () => {
    const mockRef: { current: { getContent: () => string } | null } = { current: null };
    renderHook(() => useExposeHandle(mockRef as any));

    const content = mockRef.current?.getContent();
    expect(content).toBe("test content");
  });

  test("clear 应清空编辑器内容", () => {
    const mockRef: { current: { clear: () => void } | null } = { current: null };
    renderHook(() => useExposeHandle(mockRef as any));

    mockRef.current?.clear();
    expect(mockEditorView.dispatch).toHaveBeenCalledWith({
      changes: { from: 0, to: 12, insert: "" }, // "test content" 长度
    });
  });

  test("setCursor 应正确处理错误输入", () => {
    const mockRef: { current: { setCursor: (num1: number, num2: number) => void } | null } = {
      current: null,
    };
    renderHook(() => useExposeHandle(mockRef as any));
    expect(() => mockRef.current?.setCursor(5, 10)).toThrowError("start 必须比 end 大"); // start < end
  });

  test("getSelection 应返回选中内容", () => {
    const mockRef: { current: { getSelection: () => string } | null } = { current: null };
    renderHook(() => useExposeHandle(mockRef as any));
    mockRef.current?.getSelection();
    expect(mockEditorView.state.sliceDoc).toHaveBeenCalledWith(0, 0);
  });

  test("当编辑器实例不存在时应安全处理", () => {
    // 覆盖模拟存储返回空实例
    vi.mocked(useEditorContentStore).mockReturnValueOnce({ editorView: null } as any);

    interface MockRef {
      current: {
        getContent: () => void;
        getCursor: () => void;
        setContent: (s: string) => void;
      } | null;
    }

    const mockRef: MockRef = { current: null };
    renderHook(() => useExposeHandle(mockRef as any));

    expect(mockRef.current?.getContent()).toBe("");
    expect(mockRef.current?.getCursor()).toEqual({ from: 0, to: 0 });
    expect(() => mockRef.current?.setContent("test")).not.toThrow();
  });
});
