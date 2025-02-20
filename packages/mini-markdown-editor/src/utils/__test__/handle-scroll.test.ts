import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  handleEditorScroll,
  handlePreviewScroll,
  handleScrollTop,
  scrollSynchronizer,
} from "../handle-scroll";
import type { EditorView } from "@codemirror/view";

// 模拟 DOM 环境
const mockPreviewView = document.createElement("div");
mockPreviewView.scrollTo = vi.fn();
const mockEditorView = {
  scrollDOM: document.createElement("div"),
  state: { doc: { lines: 100 } },
} as unknown as EditorView;
mockEditorView.scrollDOM.scrollTo = vi.fn();

describe("handle-scroll Utils测试", () => {
  beforeEach(() => {
    // 重置所有模拟调用
    vi.restoreAllMocks();
  });

  // 测试 handleEditorScroll
  describe("handleEditorScroll", () => {
    test("正常调用时应触发同步逻辑", () => {
      const spy = vi.spyOn(scrollSynchronizer, "handleEditorScroll");

      handleEditorScroll({
        editorView: mockEditorView,
        previewView: mockPreviewView,
      });

      expect(spy).toHaveBeenCalledWith(mockEditorView, mockPreviewView);
    });
  });

  // 测试 handlePreviewScroll
  describe("handlePreviewScroll", () => {
    test("正常调用时应触发同步逻辑", () => {
      const spy = vi.spyOn(scrollSynchronizer, "handlePreviewScroll");

      handlePreviewScroll({
        editorView: mockEditorView,
        previewView: mockPreviewView,
      });

      expect(spy).toHaveBeenCalledWith(mockPreviewView, mockEditorView);
    });
  });

  // 测试 handleScrollTop
  describe("handleScrollTop", () => {
    test("正常调用时应触发置顶逻辑", () => {
      const spy = vi.spyOn(scrollSynchronizer, "handleScrollTop");

      handleScrollTop({
        editorView: mockEditorView,
        previewView: mockPreviewView,
      });

      expect(spy).toHaveBeenCalledWith(mockEditorView, mockPreviewView);
    });
  });
});
