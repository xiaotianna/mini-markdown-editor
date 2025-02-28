import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Editor from "../index";
import { useEditorContentStore } from "@/store/editor";
import { usePersistEditorContent } from "@/hooks/use-persist-editor-content";
import { toolbarConfig } from "@/config/toolbar";
import { handleEditorScroll } from "@/utils/handle-scroll";
import { createEditorExtensions } from "@/extensions/codemirror";
import { ChangeEvent } from "react";
import { useGlobalConfig } from "@/hooks/use-global-config";
// 模拟核心依赖项
vi.mock("@/hooks/use-global-config", () => {
  return {
    useGlobalConfig: vi.fn(),
  };
});

vi.mock("@uiw/react-codemirror", () => ({
  default: ({ extensions, onChange, onCreateEditor, basicSetup, ...props }: any) => {
    const handleInput = (e: ChangeEvent) => {
      onChange(e.target.textContent, { view: null });
    };
    const handleScroll = () => {
      extensions.scroll();
    };
    onCreateEditor(document.createElement("div"));
    return (
      <textarea
        data-testid="codemirror-mock"
        basicsetup={basicSetup}
        {...props}
        onScroll={handleScroll}
        onInput={handleInput}
      >
        {props.value}
      </textarea>
    );
  },
}));

vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(),
}));

vi.mock("@/hooks/use-persist-editor-content", () => {
  const getContent = vi.fn(() => "initial content");
  const saveContent = vi.fn();
  return {
    usePersistEditorContent: vi.fn(() => ({
      saveContent,
      getContent,
    })),
  };
});

vi.mock("@/utils/handle-scroll", () => ({
  handleEditorScroll: vi.fn(),
}));

vi.mock("@/config/toolbar", () => ({
  toolbarConfig: {
    getAllToolbars: vi.fn(() => []),
  },
}));

// 模拟 CodeMirror 扩展
vi.mock("@/extensions/codemirror", () => ({
  createEditorExtensions: vi.fn(({ eventExt }: any) => ({ scroll: eventExt.scroll })),
}));

//模拟事件
vi.mock("@uiw/codemirror-extensions-events", () => ({
  scroll: (arg: any) => arg,
}));

describe("Editor 组件测试", () => {
  const mockSetContent = vi.fn();
  const mockSetEditorView = vi.fn();
  const mockUseEditorContentStore = vi.mocked(useEditorContentStore);
  const mockToolbarConfig = vi.mocked(toolbarConfig);
  const onChange = vi.fn(),
    onDragUpload = vi.fn(),
    onPatseUpload = vi.fn();
  const editorContentStoreReturnValue = {
    content: "test content",
    setContent: mockSetContent,
    scrollWrapper: "editor",
    setScrollWrapper: vi.fn(),
    setEditorView: mockSetEditorView,
    previewView: document.createElement("div"),
    editorView: {
      dispatch: vi.fn(),
      view: document.createElement("div"),
    } as any,
  };
  const globalConfigRuturnValue = {
    theme: "light" as const,
    lineNumbers: true,
    enableShortcuts: true,
    onChange,
    onDragUpload,
    onPatseUpload,
  };
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEditorContentStore.mockReturnValue(editorContentStoreReturnValue);
    vi.mocked(useGlobalConfig).mockReturnValue(globalConfigRuturnValue);
  });

  test("应正确初始化编辑器", () => {
    render(<Editor isSyncScroll={false} />);

    // 验证 CodeMirror 渲染
    expect(screen.getByTestId("codemirror-mock")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();

    // 验证持久化内容获取
    expect(usePersistEditorContent().getContent).toHaveBeenCalled();
  });

  test("内容变更应触发保存和回调", async () => {
    const mockSaveContent = vi.fn();
    vi.mocked(usePersistEditorContent).mockReturnValueOnce({
      saveContent: mockSaveContent,
      getContent: vi.fn(),
    });

    render(<Editor isSyncScroll={false} />);

    // 模拟内容变更
    const newContent = "new content";
    fireEvent.input(screen.getByTestId("codemirror-mock"), { target: { textContent: newContent } });
    await waitFor(() => {
      expect(mockSaveContent).toHaveBeenCalledWith(newContent);
      expect(mockSaveContent).toHaveBeenCalled();
    });
  });

  test("应处理滚动同步逻辑", async () => {
    render(<Editor isSyncScroll={true} />);

    // 模拟滚动事件
    const scrollEvent = new Event("scroll");
    screen.getByTestId("codemirror-mock").dispatchEvent(scrollEvent);

    await waitFor(() => {
      expect(handleEditorScroll).toHaveBeenCalled();
    });
  });

  test("应响应主题和行号配置变化", () => {
    vi.mocked(useGlobalConfig).mockReturnValue({
      ...globalConfigRuturnValue,
      theme: "dark",
      lineNumbers: true,
    });
    const { rerender } = render(<Editor isSyncScroll={false} />);

    // 验证初始配置
    expect(screen.getByTestId("codemirror-mock")).toHaveAttribute("theme", "dark");
    vi.mocked(useGlobalConfig).mockReturnValue({
      ...globalConfigRuturnValue,
      theme: "light",
      lineNumbers: false,
    });
    // 更新配置重新渲染
    rerender(<Editor isSyncScroll={false} />);
    expect(screen.getByTestId("codemirror-mock")).toHaveAttribute("theme", "light");
  });

  test("应初始化编辑器扩展", () => {
    mockToolbarConfig.getAllToolbars.mockReturnValueOnce([{ type: "bold" }]);
    render(<Editor isSyncScroll={false} />);
    expect(createEditorExtensions).toHaveBeenCalledWith(
      expect.objectContaining({
        toolbars: [{ type: "bold" }],
        enableShortcuts: true,
      }),
    );
  });

  test("应处理空内容场景", () => {
    mockUseEditorContentStore.mockReturnValueOnce({
      ...editorContentStoreReturnValue,
      content: "",
      setContent: vi.fn(),
    });

    render(<Editor isSyncScroll={false} />);
    expect(screen.getByTestId("codemirror-mock")).toBeEmptyDOMElement();
  });
});
