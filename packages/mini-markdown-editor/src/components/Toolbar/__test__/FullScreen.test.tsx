import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import FullScreen from "../FullScreen";
import { useToolbarStore } from "@/store/toolbar";
import { t } from "@/locales";

// 模拟依赖项
vi.mock("@/store/toolbar", () => ({
  useToolbarStore: vi.fn(),
}));

vi.mock("@/locales", () => ({
  t: vi.fn((key: string) => key + "_translated"),
}));

vi.mock("@/components/base/IconTooltip", () => ({
  default: ({ children, ...props }: any) => (
    <div data-testid="tooltip" {...props}>
      {children}
    </div>
  ),
}));

describe("FullScreen 组件测试", () => {
  const mockSetIsFullScreen = vi.fn();
  const mockUseToolbarStore = vi.mocked(useToolbarStore);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseToolbarStore.mockReturnValue({
      isFullScreen: false,
      setIsFullScreen: mockSetIsFullScreen,
    });
  });

  test("应正确渲染默认状态", () => {
    const { container } = render(<FullScreen />);
    expect(container.querySelector(".icon")).toBeInTheDocument();
    // 验证 Tooltip 属性
    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveAttribute("placement", "top");
    expect(tooltip).toHaveAttribute("content", "TOOLBAR.FULLSCREEN_translated");
    expect(tooltip).toHaveAttribute("description", "Ctrl + Alt + F");
  });

  test("点击应切换全屏状态", async () => {
    render(<FullScreen />);
    await userEvent.click(screen.getByTestId("tooltip"));
    expect(mockSetIsFullScreen).toHaveBeenCalledWith(true);
  });

  test("全屏状态应显示退出图标", () => {
    mockUseToolbarStore.mockReturnValue({
      isFullScreen: true,
      setIsFullScreen: mockSetIsFullScreen,
    });

    render(<FullScreen />);
    expect(screen.getByTestId("tooltip")).toHaveAttribute("placement", "bottom");
  });

  test("应正确使用国际化", () => {
    render(<FullScreen />);
    expect(t).toHaveBeenCalledWith("TOOLBAR.FULLSCREEN");
  });

  test("应处理图标加载异常", () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const { container } = render(<FullScreen />);
    expect(container.querySelector(".icon")).not.toBeNull();

    console.error = originalConsoleError;
  });
});
