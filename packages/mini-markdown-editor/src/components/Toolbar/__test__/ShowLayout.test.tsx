import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Write, Read, Contents, Help, Output } from "../ShowLayout";
import { useToolbarStore } from "@/store/toolbar";
import { t } from "@/locales";

// 模拟依赖项
vi.mock("@/store/toolbar", () => ({
  useToolbarStore: vi.fn(),
}));

vi.mock("@/locales", () => ({
  t: vi.fn((key: string) => key + "_translated"),
}));

// 模拟子组件
vi.mock("@/components/Sidebar/Contents", () => ({
  default: () => <div>Contents Sidebar</div>,
}));
vi.mock("@/components/Sidebar/Help", () => ({
  default: () => <div>Help Sidebar</div>,
}));
vi.mock("@/components/Sidebar/Output", () => ({
  default: () => <div>Output Sidebar</div>,
}));

// 通用测试配置
const mockUseToolbarStore = vi.mocked(useToolbarStore);
const mockSetSidebar = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockUseToolbarStore.mockReturnValue({
    isOnlyWrite: false,
    setIsOnlyWrite: vi.fn(),
    isOnlyPreview: false,
    setIsOnlyPreview: vi.fn(),
    isSidebar: false,
    componentMark: null,
    setSidebar: mockSetSidebar,
  });
});

describe("ShowLayout 组件测试", () => {
  describe("Write 组件", () => {
    test("应正确切换只写模式", async () => {
      const mockSetIsOnlyWrite = vi.fn();
      mockUseToolbarStore.mockReturnValue({
        isOnlyWrite: false,
        setIsOnlyWrite: mockSetIsOnlyWrite,
      });

      const { container } = render(<Write />);
      await userEvent.click(container.querySelector("svg")!);
      expect(mockSetIsOnlyWrite).toHaveBeenCalled();
    });

    test("激活时应显示选中颜色", () => {
      mockUseToolbarStore.mockReturnValue({
        isOnlyWrite: true,
        setIsOnlyWrite: vi.fn(),
      });

      const { container } = render(<Write />);
      expect(container.querySelector("div.sc-FEMpB")).toHaveStyle("color: #0366d6");
    });
  });

  describe("Read 组件", () => {
    test("应正确切换仅预览模式", async () => {
      const mockSetIsOnlyPreview = vi.fn();
      mockUseToolbarStore.mockReturnValue({
        isOnlyPreview: false,
        setIsOnlyPreview: mockSetIsOnlyPreview,
      });

      const { container } = render(<Read />);
      await userEvent.click(container.querySelector("svg")!);
      expect(mockSetIsOnlyPreview).toHaveBeenCalled();
    });
  });

  describe("Contents 组件", () => {
    test("点击应打开目录侧边栏", async () => {
      const { container } = render(<Contents />);
      await userEvent.click(container.querySelector("svg")!);

      expect(mockSetSidebar).toHaveBeenCalledWith(expect.anything(), "Contents");
    });

    test("激活时应高亮显示", () => {
      mockUseToolbarStore.mockReturnValue({
        isSidebar: true,
        componentMark: "Contents",
      });

      const { container } = render(<Contents />);
      expect(container.querySelector("div.sc-FEMpB")).toHaveStyle("color: #0366d6");
    });
  });

  describe("Help 组件", () => {
    test("点击应打开帮助侧边栏", async () => {
      const { container } = render(<Help />);
      await userEvent.click(container.querySelector("svg")!);

      expect(mockSetSidebar).toHaveBeenCalledWith(expect.anything(), "Help");
    });
  });

  describe("Output 组件", () => {
    test("点击应打开导出侧边栏", async () => {
      const { container } = render(<Output />);
      await userEvent.click(container.querySelector("svg")!);

      expect(mockSetSidebar).toHaveBeenCalledWith(expect.anything(), "Output");
    });

    test("当其他侧边栏打开时应取消高亮", () => {
      mockUseToolbarStore.mockReturnValue({
        isSidebar: true,
        componentMark: "Help",
      });

      const { container } = render(<Output />);
      expect(container.querySelector("div.sc-FEMpB")).not.toHaveStyle("color: #0366d6");
    });
  });

  describe("公共功能", () => {
    test("应正确应用国际化", () => {
      render(
        <>
          <Write />
          <Read />
          <Contents />
        </>,
      );

      expect(t).toHaveBeenCalledWith("TOOLBAR.WRITE");
      expect(t).toHaveBeenCalledWith("TOOLBAR.PREVIEW");
      expect(t).toHaveBeenCalledWith("TOOLBAR.CONTENTS");
    });
  });
});
