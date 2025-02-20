import { describe, test, expect } from "vitest";
import { formatContents } from "../format-contents";

// 创建带层级的 DOM 元素集合
function createTestElements(elements: Array<{ tag: string; line: string; text: string }>) {
  const container = document.createElement("div");
  elements.forEach(({ tag, line, text }) => {
    const el = document.createElement(tag);
    el.setAttribute("data-line", line);
    el.textContent = text;
    container.appendChild(el);
  });
  return container.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6");
}

describe("formatContents Utils测试", () => {
  // 基础功能测试
  test("应正确转换单层标题结构", () => {
    const nodeList = createTestElements([
      { tag: "h2", line: "1", text: "标题1" },
      { tag: "h2", line: "2", text: "标题2" },
    ]);

    const result = formatContents(nodeList);
    expect(result).toEqual([
      expect.objectContaining({ key: "1", nodeName: "H2", children: [] }),
      expect.objectContaining({ key: "2", nodeName: "H2", children: [] }),
    ]);
  });

  // 嵌套结构测试
  test("应正确生成层级嵌套结构", () => {
    const nodeList = createTestElements([
      { tag: "h2", line: "1", text: "父标题" },
      { tag: "h3", line: "2", text: "子标题1" },
      { tag: "h3", line: "3", text: "子标题2" },
    ]);

    const result = formatContents(nodeList);
    expect(result).toEqual([
      expect.objectContaining({
        key: "1",
        children: [expect.objectContaining({ key: "2" }), expect.objectContaining({ key: "3" })],
      }),
    ]);
  });

  // 复杂层级测试
  test("应处理多级嵌套和层级回退", () => {
    const nodeList = createTestElements([
      { tag: "h2", line: "1", text: "H2-1" },
      { tag: "h3", line: "2", text: "H3-1" },
      { tag: "h4", line: "3", text: "H4-1" },
      { tag: "h2", line: "4", text: "H2-2" },
      { tag: "h3", line: "5", text: "H3-2" },
    ]);

    const result = formatContents(nodeList);
    expect(result).toEqual([
      expect.objectContaining({
        key: "1",
        children: [
          expect.objectContaining({
            key: "2",
            children: [expect.objectContaining({ key: "3" })],
          }),
        ],
      }),
      expect.objectContaining({
        key: "4",
        children: [expect.objectContaining({ key: "5" })],
      }),
    ]);
  });

  // 边界条件测试
  test("处理空输入应返回空数组", () => {
    const emptyList = createTestElements([]);
    expect(formatContents(emptyList)).toEqual([]);
  });

  // 混合层级顺序测试
  test("应正确处理层级升降序列", () => {
    const nodeList = createTestElements([
      { tag: "h2", line: "1", text: "A" },
      { tag: "h3", line: "2", text: "B" },
      { tag: "h4", line: "3", text: "C" },
      { tag: "h3", line: "4", text: "D" },
      { tag: "h2", line: "5", text: "E" },
    ]);

    const result = formatContents(nodeList);
    expect(result).toEqual([
      expect.objectContaining({
        key: "1",
        children: [
          expect.objectContaining({
            key: "2",
            children: [expect.objectContaining({ key: "3" })],
          }),
          expect.objectContaining({ key: "4" }),
        ],
      }),
      expect.objectContaining({ key: "5" }),
    ]);
  });
});
