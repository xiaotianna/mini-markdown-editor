import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CopyCodeButton } from "../CopyCodeButton";
import { message } from "antd";
import { getCurrentLocale } from "@/locales";

// 模拟依赖项
vi.mock("@/locales", () => ({
  getCurrentLocale: vi.fn(() => "en"),
}));

vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("antd")>();
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// 模拟剪贴板API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};
(global as any).navigator.clipboard = mockClipboard;

// 模拟环境变量
vi.mock("import.meta.env", () => ({
  PROD: false,
}));
//监听console.error
const consoleError = vi.spyOn(console, "error");

describe("CopyCodeButton 组件测试", () => {
  beforeEach(() => {
    //默认开发环境及英文语言
    vi.mocked(import.meta.env).PROD = false;
    vi.mocked(getCurrentLocale).mockReturnValue("en");
    vi.clearAllMocks();
  });

  test("生产环境下不渲染", () => {
    vi.mocked(import.meta.env).PROD = true;
    const { container } = render(<CopyCodeButton />);
    expect(container).toBeEmptyDOMElement();
  });

  test("开发环境下根据语言显示正确文本", () => {
    // 测试英文环境
    render(<CopyCodeButton />);
    screen.debug();
    expect(screen.getByText("Copy Test Code")).toBeInTheDocument();

    // 测试中文环境
    vi.mocked(getCurrentLocale).mockReturnValue("cn");
    render(<CopyCodeButton />);
    expect(screen.getByText("复制测试代码")).toBeInTheDocument();

    // 测试繁体中文环境
    vi.mocked(getCurrentLocale).mockReturnValue("tw");
    render(<CopyCodeButton />);
    expect(screen.getByText("複製測試代碼")).toBeInTheDocument();
  });

  test("点击按钮触发复制操作", async () => {
    render(<CopyCodeButton />);
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith({
        content: "Copied!",
        duration: 1.5,
      });
    });
  });

  test("复制失败时显示错误提示", async () => {
    const error = new Error("Clipboard error");
    mockClipboard.writeText.mockRejectedValueOnce(error);

    render(<CopyCodeButton />);
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith("Copy Error:", error);
      expect(message.error).toHaveBeenCalledWith({
        content: "Copy failed",
        duration: 2,
      });
    });
  });
});
