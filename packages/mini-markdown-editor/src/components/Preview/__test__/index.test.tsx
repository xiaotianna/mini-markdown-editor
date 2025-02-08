import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Preview from "@/components/Preview";
import { ConfigContext } from "@/components/providers/config-provider";
import { useEditorContentStore } from "@/store/editor";
import { handlePreviewScroll } from "@/utils/handle-scroll";
import { useCopyCode } from "@/hooks/use-copy-code";

// Mock store
vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(() => ({
    scrollWrapper: "preview",
    setScrollWrapper: vi.fn(),
    setPreviewView: vi.fn(),
    editorView: {},
  })),
}));

// Mock handlePreviewScroll
vi.mock("@/utils/handle-scroll", () => ({
  handlePreviewScroll: vi.fn(),
}));

// Mock useCopyCode
vi.mock("@/hooks/use-copy-code", () => ({
  useCopyCode: vi.fn(),
}));

describe("Preview 组件测试", () => {
  const mockContent = "# 标题\n\n这是一些测试内容。";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该正确渲染 Markdown 转换后的 HTML", () => {
    render(<Preview content={mockContent} isSyncScroll={false} />);

    // 确保 HTML 内容被正确渲染
    expect(screen.getByText("标题")).toBeInTheDocument();
    expect(screen.getByText("这是一些测试内容。")).toBeInTheDocument();
  });

  it("当 isSyncScroll 为 true 时，滚动事件应调用 handlePreviewScroll", () => {
    const { container } = render(<Preview content={mockContent} isSyncScroll={true} />);
    const previewElement = container.querySelector(".markdown-editor-preview");
    expect(previewElement).not.toBeNull();
    if (previewElement) {
      fireEvent.scroll(previewElement);
      expect(handlePreviewScroll).toHaveBeenCalled();
    }
  });

  it("当鼠标进入预览区域时，应该调用 setScrollWrapper", () => {
    const setScrollWrapperMock = vi.fn();
    //ts类型助手
    vi.mocked(useEditorContentStore).mockReturnValue({
      scrollWrapper: "editor",
      setScrollWrapper: setScrollWrapperMock,
      setPreviewView: vi.fn(),
      editorView: {},
    });

    const { container } = render(<Preview content={mockContent} isSyncScroll={true} />);
    const previewElement = container.querySelector(".markdown-editor-preview");
    expect(previewElement).not.toBeNull();

    if (previewElement) {
      fireEvent.mouseEnter(previewElement);
      expect(setScrollWrapperMock).toHaveBeenCalledWith("preview");
    }
  });

  it("应支持主题切换（light 和 dark）", () => {
    render(
      <ConfigContext.Provider value={{ theme: "dark" }}>
        <Preview content={mockContent} isSyncScroll={false} />
      </ConfigContext.Provider>,
    );

    // 由于 `usePreviewTheme` 只影响样式，不容易直接测试，我们只确保组件能够正确渲染
    expect(screen.getByText("标题")).toBeInTheDocument();
  });

  it("useCopyCode应被调用", () => {
    render(<Preview content={"```js\nconsole.log('test')\n```"} isSyncScroll={false} />);
    expect(useCopyCode).toHaveBeenCalled();
  });
});
