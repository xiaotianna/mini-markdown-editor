import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import Output from "../Output";
import { exportHTML } from "@/utils/output-html";
import { exportPdf } from "@/utils/output-pdf";

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
});

vi.mock("@/store/editor", () => ({
  useEditorContentStore: vi.fn(() => "<p>Preview Content</p>"),
}));

vi.mock("@/utils/output-html", () => ({
  exportHTML: vi.fn(),
}));

vi.mock("@/utils/output-pdf", () => ({
  exportPdf: vi.fn(),
}));

describe("Output 组件测试", () => {
  it("正确渲染", () => {
    render(<Output />);
    expect(screen.getByText("导出文件类型")).toBeInTheDocument();
    expect(screen.getByText("导出文件名")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导 出" })).toBeInTheDocument();
  });

  it("正确调用PDF导出函数", async () => {
    render(<Output />);
    fireEvent.change(screen.getByPlaceholderText("请填入文件名"), {
      target: { value: "test-file" },
    });
    fireEvent.click(screen.getByText("PDF"));
    fireEvent.click(screen.getByRole("button", { name: "导 出" }));
    waitFor(() => {
      expect(exportPdf).toHaveBeenCalledWith("<p>Preview Content</p>", "test-file");
    });
  });

  it("正确调用html导出函数", async () => {
    render(<Output />);
    fireEvent.change(screen.getByPlaceholderText("请填入文件名"), {
      target: { value: "test-file" },
    });
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "导出文件类型" }));

    waitFor(() => {
      fireEvent.click(screen.getByRole("option", { name: "HTML" }));
      fireEvent.click(screen.getByRole("button", { name: "导 出" }));
      expect(exportHTML).toHaveBeenCalledWith("<p>Preview Content</p>", "test-file");
    });
  });
});
