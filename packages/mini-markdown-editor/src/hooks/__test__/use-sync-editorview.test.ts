import { renderHook } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { useSyncEditorView } from "../use-sync-editorview";
import { useEditorContentStore } from "@/store/editor";
import { insertContent } from "@/utils/insert-content";

// 模拟依赖模块
vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(),
}));

vi.mock("@/utils/insert-content", () => ({
  insertContent: {
    setEditorView: vi.fn(),
  },
}));

describe("useSyncEditorView Hook测试", () => {
  const mockEditorView = { id: "editor-1" };
  const mockSetEditorView = vi.mocked(insertContent.setEditorView);

  beforeEach(() => {
    vi.clearAllMocks();
    // 默认返回有效 editorView
    vi.mocked(useEditorContentStore).mockImplementation((selector: any) =>
      selector({ editorView: mockEditorView }),
    );
  });

  test("应在挂载时同步 editorView 实例", () => {
    renderHook(() => useSyncEditorView());

    expect(mockSetEditorView).toHaveBeenCalledTimes(1);
    expect(mockSetEditorView).toHaveBeenCalledWith(mockEditorView);
  });

  test("当 editorView 变化时应重新同步", () => {
    const { rerender } = renderHook(() => useSyncEditorView());

    // 初始调用
    expect(mockSetEditorView).toHaveBeenCalledTimes(1);

    // 更新 editorView
    const newEditorView = { id: "editor-2" };
    vi.mocked(useEditorContentStore).mockImplementation((selector: any) =>
      selector({ editorView: newEditorView }),
    );
    rerender();

    expect(mockSetEditorView).toHaveBeenCalledTimes(2);
    expect(mockSetEditorView).toHaveBeenCalledWith(newEditorView);
  });

  test("当 editorView 为 null 时应安全处理", () => {
    vi.mocked(useEditorContentStore).mockImplementation((selector: any) =>
      selector({ editorView: null }),
    );

    renderHook(() => useSyncEditorView());

    expect(mockSetEditorView).toHaveBeenCalledWith(null);
  });

  test("应在每次渲染时同步（无依赖数组）", () => {
    const { rerender } = renderHook(() => useSyncEditorView());

    rerender(); // 强制重新渲染
    rerender(); // 再次重新渲染

    // 预期每次渲染都会触发同步（3次初始渲染+2次重渲染）
    expect(mockSetEditorView).toHaveBeenCalledTimes(3);
  });
});
