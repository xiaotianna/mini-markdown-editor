import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Status from "../index";
import { useEditorContentStore } from "@/store/editor";
import { handleScrollTop } from "@/utils/handle-scroll";
vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(),
}));
// Mock 工具函数
vi.mock("@/utils/handle-scroll", () => ({
  handleScrollTop: vi.fn(),
}));
describe("Status 组件测试", () => {
  it("正确展示内容字数", () => {
    vi.mocked(useEditorContentStore).mockReturnValue({
      content: "Hello World",
      editorView: null,
      previewView: null,
    });

    render(<Status isSyncScroll={false} updateSyncScrollStatus={vi.fn()} />);

    expect(screen.getByText("字数: 10")).toBeInTheDocument();
  });

  it("当checkbox被点击时应该调用updateSyncScrollStatus", () => {
    const updateSyncScrollStatus = vi.fn();
    vi.mocked(useEditorContentStore).mockReturnValue({
      content: "",
      editorView: null,
      previewView: null,
    });

    render(<Status isSyncScroll={false} updateSyncScrollStatus={updateSyncScrollStatus} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(updateSyncScrollStatus).toHaveBeenCalledWith(true);
  });

  it("当scroll-top被点击时应该调用handleScrollTop", () => {
    vi.mocked(useEditorContentStore).mockReturnValue({
      content: "",
      editorView: {},
      previewView: {},
    });

    render(<Status isSyncScroll={false} updateSyncScrollStatus={vi.fn()} />);

    const scrollTopButton = screen.getByText("滚动到顶部");
    fireEvent.click(scrollTopButton);

    expect(handleScrollTop).toHaveBeenCalled();
  });
});
