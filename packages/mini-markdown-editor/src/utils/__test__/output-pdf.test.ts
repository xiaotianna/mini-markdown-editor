import { describe, test, expect, vi, beforeEach } from "vitest";
import { exportPdf } from "../output-pdf";
import html2pdf from "html2pdf.js";

// 模拟 html2pdf 库
vi.mock("html2pdf.js", () => {
  const instance = {
    from: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    save: vi.fn(),
  };
  return {
    default: vi.fn(() => instance),
  };
});

// 模拟 window 对象
const mockWindow = {
  scrollX: 100,
  scrollY: 200,
};
(global as any).window = mockWindow;

describe("exportPdf Utils测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("应正确调用 html2pdf 方法链", async () => {
    const mockElement = document.createElement("div");
    await exportPdf(mockElement, "test-file");

    // 验证方法调用链
    expect(html2pdf).toHaveBeenCalled();
    expect(html2pdf().from).toHaveBeenCalledWith(mockElement);
    expect(html2pdf().set).toHaveBeenCalledWith(expect.any(Object));
    expect(html2pdf().save).toHaveBeenCalled();
  });

  test("应包含正确的配置选项", async () => {
    const mockElement = document.createElement("div");
    await exportPdf(mockElement, "test-file");

    // 验证配置参数
    const expectedOptions = {
      margin: 10,
      filename: "test-file",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: -100, // 来自 window.scrollX
        scrollY: -200, // 来自 window.scrollY
        windowWidth: 2100,
        windowHeight: 2970,
        includeShadowDom: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    expect(html2pdf().set).toHaveBeenCalledWith(expectedOptions);
  });

  test("Promise 应始终 resolve", async () => {
    const mockElement = document.createElement("div");
    const result = await exportPdf(mockElement, "test-file");
    expect(result).toEqual({});
  });

  test("应处理空元素输入", async () => {
    const consoleSpy = vi.spyOn(console, "error");
    // 测试 null 元素
    await exportPdf(null as any, "test-file");

    // 验证基础调用仍然执行
    expect(html2pdf().from).toHaveBeenCalledWith(null);
    expect(consoleSpy).not.toHaveBeenCalled(); // 根据当前实现不会报错
  });
});
