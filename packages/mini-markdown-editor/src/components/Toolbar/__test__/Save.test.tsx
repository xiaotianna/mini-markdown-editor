import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Save from "../Save";
import { useEditorContentStore } from "@/store/editor";
import { useSaveContent } from "@/hooks/use-save-content";
import { useGlobalConfig } from "@/hooks/use-global-config";
import { t } from "@/locales";

// 模拟依赖项
vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(),
}));

vi.mock("@/hooks/use-save-content", () => ({
  useSaveContent: vi.fn(),
}));

vi.mock("@/hooks/use-global-config", () => ({
  useGlobalConfig: vi.fn(),
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

describe("Save 组件测试", () => {
  const mockSaveContent = vi.fn();
  const mockOnSave = vi.fn();
  const mockUseEditorContentStore = vi.mocked(useEditorContentStore);
  const mockUseGlobalConfig = vi.mocked(useGlobalConfig);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEditorContentStore.mockReturnValue({
      content: "test content",
      editorView: {} as any,
    });
    mockUseGlobalConfig.mockReturnValue({ onSave: mockOnSave });
    (useSaveContent as any).mockReturnValue(mockSaveContent);
  });

  test("应正确渲染保存按钮", () => {
    const { container } = render(<Save />);

    // 验证图标容器
    expect(container.querySelector(".icon")).toBeInTheDocument();
    // 验证提示内容
    expect(screen.getByTestId("tooltip")).toHaveAttribute("content", "TOOLBAR.SAVE_translated");
    // 验证快捷键描述
    expect(screen.getByTestId("tooltip")).toHaveAttribute("description", "Ctrl + S");
  });

  test("点击应触发保存操作", async () => {
    render(<Save />);
    await userEvent.click(screen.getByTestId("tooltip"));

    expect(mockSaveContent).toHaveBeenCalledWith("test content");
    expect(mockOnSave).toHaveBeenCalledWith("test content", expect.any(Object));
  });

  test("无内容时应跳过保存操作", async () => {
    mockUseEditorContentStore.mockReturnValue({
      content: "",
      editorView: null,
    });

    render(<Save />);
    await userEvent.click(screen.getByTestId("tooltip"));

    expect(mockSaveContent).not.toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("应正确处理空回调函数", async () => {
    mockUseGlobalConfig.mockReturnValue({ onSave: undefined });

    render(<Save />);
    await userEvent.click(screen.getByTestId("tooltip"));

    expect(mockSaveContent).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("应正确使用国际化", () => {
    render(<Save />);
    expect(t).toHaveBeenCalledWith("TOOLBAR.SAVE");
  });
});
