import { describe, test, expect, vi } from "vitest";
import { useEditorContentStore } from "../editor";
import type { EditorView } from "@codemirror/view";

// 模拟 EditorView 和 HTMLElement
const mockEditorView = { destroy: vi.fn() } as unknown as EditorView;
const mockPreviewElement = document.createElement("div");

describe("useEditorContentStore Store测试", () => {
  // 创建独立的 store 实例用于测试
  const useTestStore = useEditorContentStore;

  test("初始状态应为空值", () => {
    const state = useTestStore.getState();

    expect(state.content).toBe("");
    expect(state.scrollWrapper).toBe("");
    expect(state.editorView).toBeNull();
    expect(state.previewView).toBeNull();
  });

  test("应正确更新内容", () => {
    // 测试普通字符串
    useTestStore.getState().setContent("Hello World");
    expect(useTestStore.getState().content).toBe("Hello World");

    // 测试特殊字符
    useTestStore.getState().setContent("<div>HTML</div>");
    expect(useTestStore.getState().content).toBe("<div>HTML</div>");
  });

  test("应正确设置滚动容器标识", () => {
    useTestStore.getState().setScrollWrapper("#editor");
    expect(useTestStore.getState().scrollWrapper).toBe("#editor");

    useTestStore.getState().setScrollWrapper("");
    expect(useTestStore.getState().scrollWrapper).toBe("");
  });

  test("应正确处理编辑器视图", () => {
    // 设置编辑器视图
    useTestStore.getState().setEditorView(mockEditorView);
    expect(useTestStore.getState().editorView).toBe(mockEditorView);

    // 清除编辑器视图
    useTestStore.getState().setEditorView(null);
    expect(useTestStore.getState().editorView).toBeNull();
  });

  test("应正确处理预览视图", () => {
    // 设置预览元素
    useTestStore.getState().setPreviewView(mockPreviewElement);
    expect(useTestStore.getState().previewView).toBe(mockPreviewElement);

    // 清除预览元素
    useTestStore.getState().setPreviewView(null);
    expect(useTestStore.getState().previewView).toBeNull();
  });

  test("应支持多次连续更新", () => {
    // 连续更新内容
    useTestStore.getState().setContent("First");
    useTestStore.getState().setContent("Second");
    expect(useTestStore.getState().content).toBe("Second");

    // 混合更新不同类型状态
    useTestStore.getState().setScrollWrapper("wrapper");
    useTestStore.getState().setPreviewView(mockPreviewElement);
    useTestStore.getState().setEditorView(mockEditorView);

    const finalState = useTestStore.getState();
    expect(finalState.scrollWrapper).toBe("wrapper");
    expect(finalState.previewView).toBe(mockPreviewElement);
    expect(finalState.editorView).toBe(mockEditorView);
  });
});
