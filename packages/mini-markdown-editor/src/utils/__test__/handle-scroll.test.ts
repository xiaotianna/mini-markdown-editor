import { describe, test, expect, vi, beforeEach } from "vitest";
import type { EditorView } from "@uiw/react-codemirror";
import {
  handleEditorScroll,
  handlePreviewScroll,
  handleScrollTop,
  scrollSynchronizer,
} from "../handle-scroll";
import { waitFor } from "@testing-library/react";

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

  // 测试 ScrollSynchronizer 类的私有方法
  describe("ScrollSynchronizer 私有方法测试", () => {
    test("computeHeightMapping 应正确计算高度映射", () => {
      const instance = scrollSynchronizer;
      const spy = vi.spyOn(instance as any, "clearHeightMappings");

      instance["computeHeightMapping"]({
        editorView: mockEditorView,
        previewView: mockPreviewView,
      });

      expect(spy).toHaveBeenCalled();
    });

    test("synchronizeScroll 应正确同步滚动", () => {
      const instance = scrollSynchronizer;
      const spy = vi.spyOn(instance as any, "performProportionalScroll");

      instance["synchronizeScroll"]("editor", {
        editorView: mockEditorView,
        previewView: mockPreviewView,
      });
      waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    test("scrollToTop 应正确滚动到顶部", () => {
      const instance = scrollSynchronizer;

      instance["scrollToTop"](mockEditorView, mockPreviewView);

      expect(mockEditorView.scrollDOM.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
      expect(mockPreviewView.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });

    test("scrollToBottom 应正确滚动到底部", () => {
      const instance = scrollSynchronizer;
      const targetElement = document.createElement("div");
      const content = document.createElement("div");
      targetElement.appendChild(content);
      targetElement.style.height = "100px";
      content.style.height = "200px";
      targetElement.scrollTop = 50;
      instance["scrollToBottom"](targetElement);

      waitFor(() => {
        expect(targetElement.scrollTop).toBe(200 - 100);
      });
    });
  });
});
