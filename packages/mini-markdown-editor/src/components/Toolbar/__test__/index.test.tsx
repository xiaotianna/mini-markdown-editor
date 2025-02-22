import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Toolbar from "../index";
import { toolbarConfig } from "@/config/toolbar";
import { useSyncEditorView } from "@/hooks/use-sync-editorview";

// 模拟依赖项
vi.mock("@/config/toolbar", () => ({
  toolbarConfig: {
    getAllToolbars: vi.fn(() => [
      { type: "bold", label: "Bold" },
      { type: "line" }, // 分隔线
      { type: "italic", label: "Italic" },
    ]),
  },
}));

vi.mock("@/hooks/use-sync-editorview", () => ({
  useSyncEditorView: vi.fn(),
}));

vi.mock("../ToolbarItem", () => ({
  ToolbarItem: ({ label }: { label: string }) => <button>{label}_translated</button>,
}));

vi.mock("../CopyCodeButton", () => ({
  CopyCodeButton: () => <button data-testid="copy-button">Copy Code</button>,
}));

describe("Toolbar 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("应正确渲染组件结构", () => {
    const { container } = render(<Toolbar />);
    expect(container.querySelector(".mini-editor-toolbar-content")).toBeInTheDocument();
  });

  test("应正确渲染工具栏项", () => {
    render(<Toolbar />);

    // 验证工具栏项
    expect(screen.getByText("Bold_translated")).toBeInTheDocument();
    expect(screen.getByText("Italic_translated")).toBeInTheDocument();
  });

  test("应渲染复制代码按钮", () => {
    render(<Toolbar />);
    expect(screen.getByTestId("copy-button")).toBeInTheDocument();
  });

  test("应调用同步编辑器视图钩子", () => {
    render(<Toolbar />);
    expect(useSyncEditorView).toHaveBeenCalled();
  });

  test("应正确处理空工具栏配置", () => {
    vi.mocked(toolbarConfig.getAllToolbars).mockReturnValue([]);
    render(<Toolbar />);

    expect(screen.queryByTestId("divider")).toBeNull();
    const reg = /[^(Copy Code)]/;
    expect(screen.queryByRole("button", { name: reg })).toBeNull();
  });
});
