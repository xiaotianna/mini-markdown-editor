import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, beforeEach } from "vitest";
import Contents from "../Contents";
import { useEditorContentStore } from "@/store/editor";

// Mock zustand store
vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(),
}));

describe("Contents 组件测试", () => {
  //mock data
  const mockPreviewElement = document.createElement("div");
  const mockH1 = document.createElement("h1");
  mockH1.innerText = "Title 1";
  mockH1.setAttribute("data-line", "1");
  const mockH2 = document.createElement("h2");
  mockH2.innerText = "Title 2";
  mockH2.setAttribute("data-line", "2");

  const mockHeaders = [mockH1, mockH2] as unknown as NodeListOf<HTMLElement>;

  mockPreviewElement.appendChild(mockH1);
  mockPreviewElement.appendChild(mockH2);

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = "";
    mockPreviewElement.classList.add("markdown-editor-preview");
    // Mock store
    (useEditorContentStore as any).mockImplementation((selector: any) =>
      selector({ previewView: mockPreviewElement }),
    );
    document.body.appendChild(mockPreviewElement);
  });

  test("应正确渲染目录结构", async () => {
    render(<Contents />);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  test("应处理滚动高亮逻辑", async () => {
    render(<Contents />);

    // 模拟滚动位置
    mockHeaders[0].getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    mockHeaders[1].getBoundingClientRect = () => ({ top: 50 }) as DOMRect;

    await act(async () => {
      mockPreviewElement.dispatchEvent(new Event("scroll"));
    });

    // 验证第二个标题被激活
    const links = screen.getAllByRole("link");
    expect(links[1].classList.contains("ant-anchor-link-title-active")).toBe(true);
  });

  test("应处理锚点点击事件", async () => {
    const user = userEvent.setup();
    const mockScroll = vi.fn();
    HTMLElement.prototype.scrollIntoView = mockScroll;

    render(<Contents />);

    const firstLink = screen.getByText("Title 1");
    await user.click(firstLink);

    expect(mockScroll).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
    expect(firstLink.classList.contains("ant-anchor-link-title-active")).toBe(true);
  });

  test("无预览容器时不渲染内容", () => {
    document.body.innerHTML = "";
    const { container } = render(<Contents />);
    expect(container.firstChild).toBeNull();
  });

  test("内容变化时更新目录", async () => {
    const { rerender } = render(<Contents />);
    const mockH3 = document.createElement("h3");
    mockH3.innerText = "Title 3";
    mockH3.setAttribute("data-line", "3");
    mockPreviewElement.appendChild(mockH3);
    rerender(<Contents />);

    waitFor(() => {
      expect(screen.getAllByRole("link")).toHaveLength(3);
    });
  });
});
