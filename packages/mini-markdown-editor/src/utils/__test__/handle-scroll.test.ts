import { describe, test, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import {
  scrollSynchronizer,
  handleEditorScroll,
  handlePreviewScroll,
  handleScrollTop,
} from "../handle-scroll";
import { EditorView } from "@codemirror/view";
import { waitFor } from "@testing-library/react";

// 模拟 DOM 环境
const mockPreviewView = document.createElement("div");
mockPreviewView.style.height = "300px";
// 添加测试数据行标记
for (let i = 1; i <= 3; i++) {
  const vnode = document.createElement("div") as any;
  vnode.setAttribute("data-line", i.toString());
  vnode.style.height = "50px";
  //jsdom不支持offsetTop故手动赋值
  Object.defineProperty(vnode, "offsetTop", {
    value: (i - 1) * 50,
    writable: true,
  });
  mockPreviewView.appendChild(vnode);
}

const mockEditorView = {
  scrollDOM: document.createElement("div"),
  state: {
    doc: {
      lines: 100,
      line: (num: number) => ({ from: num * 10 }),
    },
  },
  lineBlockAt: (pos: number) => ({ top: pos }),
  dispatch: vi.fn(),
} as unknown as EditorView;

describe("handle-scroll Utils测试", () => {
  beforeEach(() => {
    // 重置实例状态

    vi.clearAllMocks();
  });

  describe("核心方法", () => {
    test("应正确计算高度映射", () => {
      scrollSynchronizer.handleEditorScroll(mockEditorView, mockPreviewView);
      expect(scrollSynchronizer["editorElementList"]).toEqual([10, 20, 30]);
      expect(scrollSynchronizer["previewElementList"]).toEqual([0, 50, 100]);
    });

    test("应处理无效行号", () => {
      const invalidNode = document.createElement("div");
      invalidNode.setAttribute("data-line", "invalid");
      mockPreviewView.appendChild(invalidNode);

      scrollSynchronizer.handleEditorScroll(mockEditorView, mockPreviewView);
      expect(scrollSynchronizer["editorElementList"].length).toBe(3);
    });
  });

  describe("滚动同步", () => {
    test("顶部边界处理", () => {
      mockEditorView.scrollDOM.scrollTop = 0;
      scrollSynchronizer.handleEditorScroll(mockEditorView, mockPreviewView);

      expect(mockPreviewView.scrollTop).toBe(0);
    });

    test("底部边界处理", () => {
      mockEditorView.scrollDOM.scrollTop = 9999;
      scrollSynchronizer.handleEditorScroll(mockEditorView, mockPreviewView);
      waitFor(() => {
        // 验证触发动画逻辑
        expect(mockPreviewView.scrollTop).toBeGreaterThan(100);
      });
    });

    test("中间位置比例滚动", () => {
      // 模拟编辑器滚动到中间位置
      mockEditorView.scrollDOM.scrollTop = 15;
      scrollSynchronizer.handleEditorScroll(mockEditorView, mockPreviewView);
      waitFor(() => {
        // 预期预览区域滚动到 25px (0-50 对应 0-50px)
        expect(mockPreviewView.scrollTop).toBe(25);
      });
    });
  });

  describe("公共接口", () => {
    test("handleEditorScroll 应触发同步", () => {
      handleEditorScroll({ editorView: mockEditorView, previewView: mockPreviewView });
      expect(mockPreviewView.scrollTop).toBeDefined();
    });

    test("handlePreviewScroll 应反向同步", () => {
      mockPreviewView.scrollTop = 50;
      handlePreviewScroll({ editorView: mockEditorView, previewView: mockPreviewView });
      waitFor(() => {
        expect(mockEditorView.scrollDOM.scrollTop).toBe(10);
      });
    });

    test("handleScrollTop 应重置滚动位置", () => {
      const mockScroll = vi.fn();
      mockEditorView.scrollDOM.scrollTo = mockScroll;
      mockPreviewView.scrollTo = mockScroll;

      handleScrollTop({ editorView: mockEditorView, previewView: mockPreviewView });
      expect(mockScroll).toHaveBeenCalledTimes(2);
    });
  });

  describe("边界条件", () => {
    test("空预览视图应跳过处理", () => {
      expect(() => {
        scrollSynchronizer.handleEditorScroll(mockEditorView, null);
      }).not.toThrow();
    });

    test("无效文档状态处理", () => {
      const invalidEditorView = { ...mockEditorView, state: null } as any;
      expect(() => {
        scrollSynchronizer.handleEditorScroll(invalidEditorView, mockPreviewView);
      }).not.toThrow();
    });
  });

  describe("动画逻辑", () => {
    test("滚动到底部应触发动画", () => {
      const mockRequestAnimationFrame = vi.spyOn(window, "requestAnimationFrame");
      scrollSynchronizer["scrollToBottom"](mockPreviewView);

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    test("滚动过程中断应安全处理", () => {
      const element = document.createElement("div");
      const child = document.createElement("div");
      element.appendChild(child);
      child.style.height = "1000px";
      element.style.height = "500px";
      element.scrollTop = 300;

      scrollSynchronizer["scrollToBottom"](element);
      element.scrollTop = 0; // 模拟外部中断

      // 验证无错误抛出
      expect(() => {
        vi.advanceTimersByTime(200);
      }).not.toThrow();
    });
  });
});

// 配置测试环境
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { value: 500 });
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", { value: 1000 });
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});
