import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CopyButton from "../CopyCodeButton";

// Mock navigator.clipboard
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CopyButton 组件测试", () => {
  it("应该正确渲染按钮", () => {
    render(<CopyButton content="测试内容" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("点击按钮后应该调用 navigator.clipboard.writeText", async () => {
    render(<CopyButton content="测试内容" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("测试内容");
    });
  });

  it("点击后应该显示copied state并在2秒后恢复", async () => {
    render(<CopyButton content="测试内容" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // 确保 copied 状态生效
    await waitFor(() => {
      expect(button).toHaveClass("copied");
    });

    // 2秒后 copied 状态应恢复
    await waitFor(
      () => {
        expect(button).not.toHaveClass("copied");
      },
      { timeout: 2100 },
    );
  });

  it("短时间内多次点击，复制操作应只触发一次 (防抖测试)", async () => {
    render(<CopyButton content="测试内容" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
  });
});
