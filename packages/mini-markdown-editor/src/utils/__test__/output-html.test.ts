import { describe, test, expect, vi, beforeEach } from "vitest";
import { exportHTML } from "../output-html";

// 模拟浏览器环境
const mockClick = vi.fn();
const mockDocument = {
  styleSheets: [] as any[],
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
  createElement: vi.fn(() => ({
    click: mockClick,
    href: "blob:fake-url",
    download: "test.html",
  })),
};

// 模拟全局对象
(global as any).document = mockDocument;
(global as any).URL = {
  createObjectURL: vi.fn(() => "blob:fake-url"),
  revokeObjectURL: vi.fn(),
};
(global as any).Blob = vi.fn();

describe("exportHTML Utils测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 重置模拟样式表
    mockDocument.styleSheets = [
      {
        cssRules: [
          { cssText: "body { color: red; }" },
          { cssText: ".container { padding: 20px; }" },
        ],
      },
      {
        cssRules: [], // 模拟空样式表
      },
    ];
  });
  test("应生成包含正确内容的HTML", async () => {
    // 创建测试元素
    const testElement = document.createElement("div");
    testElement.outerHTML = "<h1>Test Content</h1>";

    await exportHTML(testElement, "test-file");

    // 验证Blob内容
    const [blobParts] = (Blob as any).mock.calls[0];
    const htmlContent = blobParts[0];

    expect(htmlContent).toContain("<h1>Test Content</h1>");
    expect(htmlContent).toContain("body { color: red; }");
    expect(htmlContent).toContain(".container { padding: 20px; }");
  });

  test("应正确处理样式表访问错误", async () => {
    // 模拟样式表访问错误
    mockDocument.styleSheets[0].cssRules = null;
    const consoleSpy = vi.spyOn(console, "error");

    const testElement = document.createElement("div");
    await exportHTML(testElement, "test");
    expect(consoleSpy).toHaveBeenCalledWith("Error accessing stylesheet:", expect.any(Error));
  });

  test("应创建正确的下载链接", async () => {
    const testElement = document.createElement("div");
    await exportHTML(testElement, "download-test");

    // 验证下载链接创建
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:fake-url");
  });

  test("应清理创建的DOM元素", async () => {
    const testElement = document.createElement("div");
    await exportHTML(testElement, "test");

    expect(mockDocument.body.appendChild).toHaveBeenCalled();
    expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockDocument.createElement());
  });
});
