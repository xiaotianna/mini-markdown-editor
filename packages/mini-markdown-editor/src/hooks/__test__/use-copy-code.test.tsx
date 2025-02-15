import { render, act, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { useCopyCode } from "../use-copy-code";

// Mock ReactDOM.createRoot 和定时器
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

// Mock requestAnimationFrame
vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => setTimeout(fn, 0));

// 测试组件容器
const TestComponent = ({ node }: { node: string }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  useCopyCode({ previewRef, node });
  return <div ref={previewRef} data-testid="preview"></div>;
};

describe("useCopyCode Hook测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 重置DOM
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.clearAllTimers();
  });

  test("应在挂载时添加复制按钮", async () => {
    // 准备测试DOM结构
    const preview = document.createElement("div");
    preview.innerHTML = `
      <div class="mini-md-code-container">
        <div class="mini-md-code-right"></div>
        <code>console.log('test')</code>
      </div>
    `;
    document.body.appendChild(preview);

    const { unmount } = render(<TestComponent node="test1" />, {
      container: preview,
    });

    // 等待异步操作完成
    await act(async () => {
      vi.runAllTimers();
    });

    // 验证按钮容器已添加
    const buttons = preview.querySelectorAll(".copy-code-button-wrapper");
    waitFor(() => {
      expect(buttons.length).toBe(1);
      // 验证createRoot调用
      expect(createRoot).toHaveBeenCalledTimes(1);
    });

    unmount();
  });

  test("应在node变化时清理并重新创建按钮", async () => {
    const preview = document.createElement("div");
    preview.innerHTML = `
    <div class="mini-md-code-container">
      <div class="mini-md-code-right"></div>
      <code>console.log('updated')</code>
    </div>
  `;
    const { rerender } = render(<TestComponent node="test1" />, {
      container: preview,
    });

    // 初始渲染
    await act(async () => {
      vi.runAllTimers();
    });

    rerender(<TestComponent node="test2" />);

    await act(async () => {
      vi.runAllTimers();
    });
    // 验证清理函数被调用
    const mockRoot = createRoot({} as HTMLElement);
    waitFor(() => {
      expect(mockRoot.unmount).toHaveBeenCalled();
      expect(createRoot).toHaveBeenCalledTimes(2);
    });
  });

  test("应在卸载时执行清理", async () => {
    const preview = document.createElement("div");
    const { unmount } = render(<TestComponent node="test1" />, {
      container: preview,
    });

    await act(async () => {
      vi.runAllTimers();
    });

    // 执行卸载
    unmount();

    // 验证清理函数被调用
    const mockRoot = createRoot({} as HTMLElement);
    waitFor(() => {
      expect(mockRoot.unmount).toHaveBeenCalled();
    });
  });

  test("应处理无匹配元素的情况", async () => {
    const preview = document.createElement("div");
    preview.innerHTML = `<div class="wrong-container"></div>`;
    render(<TestComponent node="test1" />, {
      container: preview,
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(createRoot).not.toHaveBeenCalled();
  });

  test("应跳过已存在按钮的元素", async () => {
    const preview = document.createElement("div");
    preview.innerHTML = `
      <div class="mini-md-code-container">
        <div class="mini-md-code-right">
          <div class="copy-code-button"></div>
        </div>
        <code>existing button</code>
      </div>
    `;
    render(<TestComponent node="test1" />, {
      container: preview,
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(createRoot).not.toHaveBeenCalled();
  });
});
