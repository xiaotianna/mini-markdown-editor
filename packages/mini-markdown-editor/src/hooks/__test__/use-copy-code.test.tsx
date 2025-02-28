import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { useCopyCode } from "../use-copy-code";
import { createRoot } from "react-dom/client";

// 模拟 ReactDOM.createRoot
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

// 模拟 CopyButton 组件
vi.mock("@/components/Preview/CopyCodeButton", () => ({
  CopyButton: () => <div data-testid="copy-button" />,
}));

describe("useCopyCode Hook测试", () => {
  const mockPreviewContainer = document.createElement("div");
  const mockCodeBlock = `
    <div class="mini-md-code-container">
      <div class="mini-md-code-right"></div>
      <code>console.log('test')</code>
    </div>
  `;
  const mockRef = { current: mockPreviewContainer };
  const testContainer = document.createElement("div");
  beforeEach(() => {
    vi.clearAllMocks();
    mockPreviewContainer.innerHTML = mockCodeBlock;
    document.body.appendChild(mockPreviewContainer);
  });

  test("应正确添加复制按钮", async () => {
    const { unmount } = renderHook(() =>
      useCopyCode({
        previewRef: mockRef,
        node: "test-node",
      }),
    );

    // 等待异步操作完成
    await new Promise((resolve) => setTimeout(resolve, 0));

    const buttons = mockPreviewContainer.querySelectorAll('[data-testid="copy-button"]');
    waitFor(() => {
      expect(buttons.length).toBe(1);
      expect(createRoot).toHaveBeenCalled();
    });

    unmount(); // 触发清理
  });

  test("卸载时应清理所有按钮", async () => {
    const { unmount } = renderHook(() =>
      useCopyCode({
        previewRef: mockRef,
        node: "test-node",
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    unmount();
    // 验证清理函数被调用
    waitFor(() => {
      expect(createRoot(testContainer).unmount).toHaveBeenCalled();
      const buttons = mockPreviewContainer.querySelectorAll('[data-testid="copy-button"]');
      expect(buttons.length).toBe(0);
    });
  });

  test("依赖项变化时应重新创建按钮", async () => {
    const { rerender, unmount } = renderHook((props) => useCopyCode(props), {
      initialProps: {
        previewRef: mockRef,
        node: "node-1",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    const initialRootInstance = createRoot(testContainer);

    // 更新依赖项
    rerender({
      previewRef: mockRef,
      node: "node-2",
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    waitFor(() => {
      expect(createRoot).toHaveBeenCalledTimes(2);
      expect(initialRootInstance.unmount).toHaveBeenCalled();
    });

    unmount();
  });

  test("应处理重复添加按钮的情况", async () => {
    // 添加重复按钮结构
    mockPreviewContainer.innerHTML = mockCodeBlock + mockCodeBlock;

    const { unmount } = renderHook(() =>
      useCopyCode({
        previewRef: mockRef,
        node: "test-node",
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    const buttons = mockPreviewContainer.querySelectorAll('[data-testid="copy-button"]');
    waitFor(() => {
      expect(buttons.length).toBe(2);
    });

    unmount();
  });

  test("应处理无效代码块的情况", async () => {
    const consoleSpy = vi.spyOn(console, "error");
    mockPreviewContainer.innerHTML = '<div class="invalid-code"></div>';

    renderHook(() =>
      useCopyCode({
        previewRef: mockRef,
        node: "test-node",
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test("应捕获并记录错误", async () => {
    const consoleSpy = vi.spyOn(console, "error");
    const mockError = new Error("Render error");
    vi.mocked(createRoot).mockImplementationOnce(() => {
      throw mockError;
    });

    renderHook(() =>
      useCopyCode({
        previewRef: mockRef,
        node: "test-node",
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Copy Error:", mockError);
    });
  });
});
