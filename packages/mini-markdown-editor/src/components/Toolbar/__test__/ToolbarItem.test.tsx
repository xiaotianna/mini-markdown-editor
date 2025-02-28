import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ToolbarItem } from "../ToolbarItem";
import { CLASS_PREFIX } from "@/common";

// 模拟子组件
vi.mock("@/components/base/DropDownMenu", () => ({
  DropDownMenu: ({ children, list }: any) => (
    <div data-testid="dropdown-menu">
      {children}
      <div data-testid="dropdown-items">{list?.length}</div>
    </div>
  ),
}));

vi.mock("@/components/base/IconTooltip", () => ({
  default: ({ children, onClick, ...props }: any) => (
    <div data-testid="icon-tooltip" onClick={onClick} {...props}>
      {children}
    </div>
  ),
}));

describe("ToolbarItem 组件测试", () => {
  const mockOnClick = vi.fn();
  const mockT = vi.fn((key: string) => key + "_translated");

  const baseProps = {
    type: "bold",
    title: "toolbar.bold",
    icon: "<svg>bold-icon</svg>",
    t: mockT,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("应渲染普通工具项", () => {
    render(<ToolbarItem {...baseProps} />);

    // 验证基础结构
    expect(screen.getByTestId("icon-tooltip")).toBeInTheDocument();
    expect(screen.getByText("bold-icon")).toBeInTheDocument();
    expect(screen.getByTestId("icon-tooltip")).toHaveAttribute("data-testid", "icon-tooltip");
  });

  test("应触发点击事件", async () => {
    render(<ToolbarItem {...baseProps} onClick={mockOnClick} />);
    await userEvent.click(screen.getByTestId("icon-tooltip"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  test("应渲染带下拉菜单的项", () => {
    const list = [
      { type: "header1", label: "H1" },
      { type: "header2", label: "H2" },
    ];
    render(<ToolbarItem {...baseProps} list={list} />);

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-items")).toHaveTextContent("2");
    expect(screen.getByText("bold-icon")).toBeInTheDocument();
  });

  test("应渲染自定义组件", () => {
    const CustomComponent = () => <div data-testid="custom-component">Custom</div>;
    render(<ToolbarItem {...baseProps} component={<CustomComponent />} />);

    expect(screen.getByTestId("custom-component")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-tooltip")).toBeNull();
  });

  test("应正确应用国际化", () => {
    render(<ToolbarItem {...baseProps} />);
    expect(mockT).toHaveBeenCalledWith("toolbar.bold");
    expect(screen.getByTestId("icon-tooltip")).toHaveAttribute(
      "content",
      "toolbar.bold_translated",
    );
  });

  test("应处理t函数返回值为空的情况", () => {
    mockT.mockReturnValue("");
    render(<ToolbarItem {...baseProps} />);
    expect(screen.getByTestId("icon-tooltip")).toHaveAttribute("content", "toolbar.bold");
  });

  test("应正确应用类名", () => {
    const { container } = render(<ToolbarItem {...baseProps} />);
    expect(container.firstChild).toHaveClass(
      `${CLASS_PREFIX}-toolbar-item ${CLASS_PREFIX}-toolbar-item-${baseProps.type}`,
    );
  });

  test("应处理空图标情况", () => {
    render(<ToolbarItem {...baseProps} icon={undefined} />);
    expect(screen.queryByText("bold-icon")).toBeNull();
  });
});
