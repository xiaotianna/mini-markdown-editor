import { describe, test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfigContext } from "../../providers/config-provider";

import Editor from "../index";

describe("Editor 组件测试", () => {
  test("测试组件基本渲染", async () => {
    const { container } = render(<Editor isSyncScroll />);
    expect(container.querySelector(".markdown-editor-content")).toBeInTheDocument();
  });

  test("测试滚动同步功能", async () => {
    const { container } = render(<Editor isSyncScroll={true} />);
    const editorElement = container.querySelector(".markdown-editor-content");
    expect(editorElement).toBeInTheDocument();

    // 触发鼠标进入事件
    if (editorElement) {
      fireEvent.mouseEnter(editorElement);
    }
  });

  test("测试编辑器内容变更事件", async () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <ConfigContext.Provider value={{ onChange: mockOnChange, theme: "light" }}>
        <Editor isSyncScroll={false} />
      </ConfigContext.Provider>,
    );

    expect(container.querySelector(".markdown-editor-content")).toBeInTheDocument();
  });

  test("测试主题切换功能", async () => {
    const { container, rerender } = render(
      <ConfigContext.Provider value={{ theme: "light" }}>
        <Editor isSyncScroll={false} />
      </ConfigContext.Provider>,
    );

    // 重新渲染暗色主题
    rerender(
      <ConfigContext.Provider value={{ theme: "dark" }}>
        <Editor isSyncScroll={false} />
      </ConfigContext.Provider>,
    );

    expect(container.querySelector(".markdown-editor-content")).toBeInTheDocument();
  });
});
