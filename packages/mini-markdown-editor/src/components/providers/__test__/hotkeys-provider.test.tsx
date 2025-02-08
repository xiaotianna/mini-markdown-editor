import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { HotkeysProvider, HotkeysContext } from "../hotkeys-provider";
import { Hotkey } from "@/common/hotkeys";

// 测试组件：用于触发上下文方法
const TestConsumer = ({ handle = () => console.log("It is pressed") }) => {
  const { registerHandler, unregisterHandler, setEnabled } = useContext(HotkeysContext);
  return (
    <div>
      <button onClick={() => registerHandler?.(Hotkey.BOLD, handle)}>Register Bold</button>
      <button onClick={() => unregisterHandler?.(Hotkey.BOLD)}>Unregister Bold</button>
      <button onClick={() => setEnabled?.(false)}>Disable</button>
    </div>
  );
};

describe("HotkeysProvider 组件测试", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // 测试基础功能
  test("应正确提供上下文方法", () => {
    render(
      <HotkeysProvider>
        <TestConsumer />
      </HotkeysProvider>,
    );

    expect(screen.getByText("Register Bold")).toBeInTheDocument();
    expect(screen.getByText("Unregister Bold")).toBeInTheDocument();
  });

  // 测试快捷键注册与触发
  test("当注册快捷键并触发时，应调用处理程序", async () => {
    const mockHandler = vi.fn();
    const user = userEvent.setup();

    render(
      <HotkeysProvider>
        <TestConsumer handle={mockHandler} />
      </HotkeysProvider>,
    );

    // 注册快捷键
    await user.click(screen.getByText("Register Bold"));

    // 触发快捷键
    await user.keyboard("{Control>}b{/Control}");
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  // 测试禁用状态
  test("当禁用快捷键时，处理程序不应被触发", async () => {
    const mockHandler = vi.fn();
    const user = userEvent.setup();

    render(
      <HotkeysProvider>
        <TestConsumer handle={mockHandler} />
      </HotkeysProvider>,
    );

    // 注册并禁用
    await user.click(screen.getByText("Register Bold"));
    await user.click(screen.getByText("Disable"));

    // 触发快捷键
    await user.keyboard("{Control>}b{/Control}");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  // 测试注销功能
  test("当注销快捷键后，处理程序不再响应", async () => {
    const mockHandler = vi.fn();
    const user = userEvent.setup();

    render(
      <HotkeysProvider>
        <TestConsumer handle={mockHandler} />
      </HotkeysProvider>,
    );

    // 注册
    await user.click(screen.getByText("Register Bold"));

    // 触发快捷键
    await user.keyboard("{Control>}b{/Control}");
    expect(mockHandler).toHaveBeenCalledTimes(1);

    // 注销
    await user.click(screen.getByText("Unregister Bold"));
    await user.keyboard("{Control>}b{/Control}");
    expect(mockHandler).toHaveBeenCalledTimes(1); // 调用次数不变
  });
});
