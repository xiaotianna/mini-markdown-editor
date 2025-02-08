import { render, screen } from "@testing-library/react";
import { useContext, useEffect, useState } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ToolbarProvider, ToolbarContext } from "../toolbar-provider";
import type { ToolbarContextValues, ToolbarItem } from "@/types/toolbar";
import { toolbarConfig } from "@/config/toolbar";
// 模拟工具栏配置模块
vi.mock("@/config/toolbar", () => ({
  toolbarConfig: {
    getAllToolbars: vi.fn(() => [
      { type: "file", title: "文件" },
      { type: "edit", title: "编辑" },
    ]),
  },
}));
// 测试用消费者组件
const TestConsumer = () => {
  const context = useContext(ToolbarContext);
  const [testItems, setTestItems] = useState<ToolbarItem[]>([]);

  useEffect(() => {
    if (context?.toolbars) {
      setTestItems(context.toolbars);
    }
  }, [context]);

  return (
    <div>
      <div data-testid="toolbar-count">{testItems.length}</div>
      <div data-testid="first-toolbar">{testItems[0]?.title}</div>
    </div>
  );
};

describe("ToolbarProvider 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("应正确初始化工具栏配置", async () => {
    // 渲染组件
    render(
      <ToolbarProvider>
        <TestConsumer />
      </ToolbarProvider>,
    );

    // 验证初始化调用
    expect(await screen.findByTestId("toolbar-count")).toHaveTextContent("2");
    expect(await screen.findByTestId("first-toolbar")).toHaveTextContent("文件");
  });

  test("应提供有效的上下文值", () => {
    let contextValue: ToolbarContextValues = { toolbars: [] };
    // 直接访问上下文的辅助组件
    const ContextChecker = () => {
      contextValue = useContext(ToolbarContext)!;
      return null;
    };

    render(
      <ToolbarProvider>
        <ContextChecker />
      </ToolbarProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue?.toolbars).toHaveLength(2);
    expect(contextValue?.toolbars[1].type).toBe("edit");
  });

  test("应只在挂载时加载配置", async () => {
    const { rerender } = render(
      <ToolbarProvider>
        <TestConsumer />
      </ToolbarProvider>,
    );

    // 初始调用
    expect(vi.mocked(toolbarConfig.getAllToolbars)).toHaveBeenCalledTimes(1);

    // 重新渲染
    rerender(
      <ToolbarProvider>
        <TestConsumer />
      </ToolbarProvider>,
    );

    // 验证没有重复调用
    expect(toolbarConfig.getAllToolbars).toHaveBeenCalledTimes(1);
  });
});
