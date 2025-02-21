import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ToolbarProvider, ToolbarContext } from "../toolbar-provider";
import { toolbarConfig as toolbarManager } from "@/config/toolbar";
import { useContext } from "react";

// 模拟工具栏配置模块
vi.mock("@/config/toolbar", () => ({
  toolbarConfig: {
    getDefaultToolbar: vi.fn(() => [
      { type: "bold", title: "加粗" },
      { type: "italic", title: "斜体" },
    ]),
    updateToolbars: vi.fn(),
  },
}));

// 测试消费者组件
const TestConsumer = () => {
  const context = useContext(ToolbarContext);
  return (
    <div>
      {context?.toolbars.map((item) => (
        <span key={item.type} data-testid={item.type}>
          {item.title}
        </span>
      ))}
    </div>
  );
};

describe("ToolbarProvider Provider测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 基础功能测试
  test("应渲染默认工具栏", () => {
    render(
      <ToolbarProvider>
        <TestConsumer />
      </ToolbarProvider>,
    );

    expect(screen.getByTestId("bold")).toBeInTheDocument();
    expect(screen.getByTestId("italic")).toBeInTheDocument();
    expect(toolbarManager.updateToolbars).toHaveBeenCalledWith([
      expect.objectContaining({ type: "bold" }),
      expect.objectContaining({ type: "italic" }),
    ]);
  });

  // 添加工具测试
  test("应合并新增工具", () => {
    const customConfig = {
      addTools: [{ type: "underline", title: "下划线" }],
    };

    render(
      <ToolbarProvider toolbarConfig={customConfig}>
        <TestConsumer />
      </ToolbarProvider>,
    );

    expect(screen.getByTestId("bold")).toBeInTheDocument();
    expect(screen.getByTestId("italic")).toBeInTheDocument();
    expect(screen.getByTestId("underline")).toBeInTheDocument();
  });

  // 排除工具测试
  test("应过滤排除的工具", () => {
    const customConfig = {
      excludeTools: ["italic"],
    };

    render(
      <ToolbarProvider toolbarConfig={customConfig}>
        <TestConsumer />
      </ToolbarProvider>,
    );

    expect(screen.getByTestId("bold")).toBeInTheDocument();
    expect(screen.queryByTestId("italic")).toBeNull();
  });

  // 排序工具测试
  test("应按指定顺序排序工具", () => {
    const customConfig = {
      orderTools: [{ type: "italic", order: 1 }],
    };

    const { container } = render(
      <ToolbarProvider toolbarConfig={customConfig}>
        <TestConsumer />
      </ToolbarProvider>,
    );

    const items = container.querySelectorAll("[data-testid]");
    expect(items[0].getAttribute("data-testid")).toBe("italic");
    expect(items[1].getAttribute("data-testid")).toBe("bold");
  });

  // 组合功能测试
  test("应同时处理添加、排除和排序", () => {
    const customConfig = {
      addTools: [{ type: "underline", title: "下划线" }],
      excludeTools: ["bold"],
      orderTools: [{ type: "underline", order: 0 }],
    };

    render(
      <ToolbarProvider toolbarConfig={customConfig}>
        <TestConsumer />
      </ToolbarProvider>,
    );

    const items = screen.getAllByTestId(/.*/);
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute("data-testid", "underline");
    expect(items[1]).toHaveAttribute("data-testid", "italic");
  });

  // 配置更新测试
  test("配置变化时应更新工具栏", async () => {
    const { rerender } = render(
      <ToolbarProvider toolbarConfig={{ excludeTools: ["bold"] }}>
        <TestConsumer />
      </ToolbarProvider>,
    );

    expect(screen.queryByTestId("bold")).toBeNull();

    rerender(
      <ToolbarProvider toolbarConfig={{ excludeTools: ["italic"] }}>
        <TestConsumer />
      </ToolbarProvider>,
    );

    expect(screen.getByTestId("bold")).toBeInTheDocument();
    expect(screen.queryByTestId("italic")).toBeNull();
  });
});
