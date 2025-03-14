import type { Tokens } from "@/types/tokens";
import type { ParseFnParams } from "..";

// 添加单标签列表
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// 转换 html
export const parseHtml = ({
  trimmedLine,
  index,
  currentOffset,
  root,
  line,
  currentStatus,
}: ParseFnParams) => {
  const htmlBlockStartRegex = /^\s*<([a-zA-Z][a-zA-Z0-9]*)(?![^>]*\/>)[^>]*>/;
  const htmlBlockEndRegex = /<\/([a-zA-Z][a-zA-Z0-9]*)>\s*$/;
  const selfClosingTagRegex = /^\s*<([a-zA-Z][a-zA-Z0-9]*)[^>]*\/>\s*$/;
  // 添加新的单标签正则
  const voidElementRegex = /^\s*<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/;

  // 如果在HTML块内，优先处理内容
  if (currentStatus.inHtmlBlock) {
    currentStatus.htmlContent += line + "\n";

    // 检查是否匹配到最外层标签的结束标签
    if (currentStatus.htmlBlockTag && htmlBlockEndRegex.test(trimmedLine)) {
      const match = trimmedLine.match(htmlBlockEndRegex);
      const endTag = match?.[1].toLowerCase();

      if (endTag === currentStatus.htmlBlockTag) {
        currentStatus.inHtmlBlock = false;
        currentStatus.htmlBlockTag = null;
        root.children.push({
          type: "html",
          value: escapeHtml(currentStatus.htmlContent.trim()),
          position: {
            start: {
              line: index - currentStatus.htmlContent.split("\n").length + 2,
              column: 1,
              offset: currentOffset - currentStatus.htmlContent.length,
            },
            end: { line: index + 1, column: line.length + 1, offset: currentOffset + line.length },
          },
        });
        currentStatus.htmlContent = "";
      }
    }
    return true;
  }

  // 检查是否是HTML块的开始
  if (
    !currentStatus.inHtmlBlock &&
    (htmlBlockStartRegex.test(trimmedLine) || selfClosingTagRegex.test(trimmedLine))
  ) {
    // 优先检查是否是单标签
    const voidMatch = trimmedLine.match(voidElementRegex);
    const tagName = voidMatch?.[1].toLowerCase();

    // 如果是单标签，直接处理并返回
    if (tagName && voidElements.has(tagName)) {
      const dataLineAttr = ` data-line="${index + 1}"`;
      // 处理自闭合和非自闭合两种情况
      const content = selfClosingTagRegex.test(trimmedLine)
        ? line.replace("/>", `${dataLineAttr} />`)
        : line.replace(/>/, `${dataLineAttr}>`);

      root.children.push({
        type: "html",
        value: escapeHtml(content.trim()),
        position: {
          start: {
            line: index + 1,
            column: 1,
            offset: currentOffset,
          },
          end: {
            line: index + 1,
            column: trimmedLine.length + 1,
            offset: currentOffset + trimmedLine.length,
          },
        },
      });
      return true;
    }

    currentStatus.inHtmlBlock = true;
    currentStatus.htmlBlockTag = tagName || null; // 记录最外层的标签名

    // 添加 data-line 属性
    const dataLineAttr = ` data-line="${index + 1}"`;
    if (selfClosingTagRegex.test(trimmedLine)) {
      // 自闭合标签
      currentStatus.htmlContent = line.replace("/>", `${dataLineAttr} />`) + "\n";
      currentStatus.inHtmlBlock = false; // 自闭合标签不需要继续处理
      root.children.push({
        type: "html",
        value: escapeHtml(currentStatus.htmlContent.trim()),
        position: {
          start: {
            line: index + 1,
            column: 1,
            offset: currentOffset,
          },
          end: {
            line: index + 1,
            column: trimmedLine.length + 1,
            offset: currentOffset + trimmedLine.length,
          },
        },
      });
      currentStatus.htmlContent = "";
      return true;
    } else {
      // 开始标签
      currentStatus.htmlContent = line.replace(/>/, `${dataLineAttr}>`) + "\n";

      // 检查是否是单行的完整HTML块
      if (trimmedLine.includes(`</${tagName}`)) {
        currentStatus.inHtmlBlock = false;
        currentStatus.htmlBlockTag = null;
        root.children.push({
          type: "html",
          value: escapeHtml(currentStatus.htmlContent.trim()),
          position: {
            start: {
              line: index + 1,
              column: 1,
              offset: currentOffset,
            },
            end: {
              line: index + 1,
              column: trimmedLine.length + 1,
              offset: currentOffset + trimmedLine.length,
            },
          },
        });
        currentStatus.htmlContent = "";
      }
    }
    return true;
  }
};

// 对 html 标签进行转义和过滤
const escapeHtml = (unsafe: string): string => {
  // 移除所有事件处理器属性和危险属性
  const sanitized = unsafe
    .replace(/\son\w+\s*=\s*["']?[^"']*["']?/gi, "") // 移除所有事件处理器
    .replace(/\s(?:javascript|data):[^\s>]*/gi, "") // 移除javascript:和data:协议
    .replace(/\sformaction\s*=\s*["']?[^"']*["']?/gi, "") // 移除formaction属性
    .replace(/\sform\s*=\s*["']?[^"']*["']?/gi, ""); // 移除form属性

  return sanitized;
};
