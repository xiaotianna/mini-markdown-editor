import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Emoji from "../Emoji";
import { useGlobalConfig } from "@/hooks/use-global-config";
import { InsertEmojiEvent } from "@/config/toolbar/event";
import EmojiIcon from "@/assets/images/emoji.svg?raw";
import userEvent from "@testing-library/user-event";
// 模拟依赖项
vi.mock("@/hooks/use-global-config", () => ({
  useGlobalConfig: vi.fn(() => ({
    theme: "light",
    locale: "en",
  })),
}));

vi.mock("@/config/toolbar/event", () => ({
  InsertEmojiEvent: vi.fn(),
}));

vi.mock("@emoji-mart/react", () => ({
  default: (props: any) => (
    <div
      data-testid="emoji-picker"
      data-theme={props.theme}
      data-locale={props.locale}
      onClick={props.onEmojiSelect}
    >
      MockEmojiPicker
    </div>
  ),
}));

vi.mock("@/components/base/DropDownMenu", () => ({
  DropDownMenu: ({ children, dropdownRender }: any) => (
    <div>
      <div data-testid="trigger">{children}</div>
      <div data-testid="dropdown">{dropdownRender()}</div>
    </div>
  ),
}));

describe("Emoji 组件测试", () => {
  const mockUseGlobalConfig = vi.mocked(useGlobalConfig);
  const mockInsertEmojiEvent = vi.mocked(InsertEmojiEvent);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("应正确渲染图标和下拉菜单", () => {
    render(<Emoji />);

    expect(screen.getByTestId("trigger")).toContainHTML(`<div class="icon">${EmojiIcon}</div>`);
    expect(screen.getByTestId("dropdown")).toContainElement(screen.getByTestId("emoji-picker"));
  });

  test("应根据主题配置渲染 Picker", () => {
    // 默认 light 主题
    const { rerender } = render(<Emoji />);
    expect(screen.getByTestId("emoji-picker")).toHaveAttribute("data-theme", "light");

    // 切换 dark 主题
    mockUseGlobalConfig.mockReturnValue({ theme: "dark", locale: "en" });
    rerender(<Emoji />);
    expect(screen.getByTestId("emoji-picker")).toHaveAttribute("data-theme", "dark");
  });

  test("应根据语言配置设置 locale", () => {
    // 英文环境
    const { rerender } = render(<Emoji />);
    expect(screen.getByTestId("emoji-picker")).toHaveAttribute("data-locale", "en");

    // 中文环境
    mockUseGlobalConfig.mockReturnValue({ theme: "light", locale: "cn" });
    rerender(<Emoji />);
    expect(screen.getByTestId("emoji-picker")).toHaveAttribute("data-locale", "zh");
  });

  test("选择表情应触发事件", async () => {
    render(<Emoji />);
    const user = userEvent.setup();
    // 模拟选择表情
    user.click(screen.getByTestId("emoji-picker"));

    await waitFor(() => {
      expect(mockInsertEmojiEvent).toHaveBeenCalled();
    });
  });
});
