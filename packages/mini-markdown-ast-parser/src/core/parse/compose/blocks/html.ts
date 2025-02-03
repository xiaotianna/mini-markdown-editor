import type { Tokens } from "@/types/tokens";
import type { ParseFnParams } from "..";

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
  // 检查是否是HTML块的开始
  if (!currentStatus.inHtmlBlock && htmlBlockStartRegex.test(trimmedLine)) {
    currentStatus.inHtmlBlock = true;
    // 添加 data-line 属性
    const dataLineAttr = ` data-line="${index + 1}"`;
    if (trimmedLine.endsWith("/>")) {
      // 自闭合标签
      currentStatus.htmlContent = line.replace("/>", `${dataLineAttr} />`) + "\n";
    } else {
      // 开始标签
      currentStatus.htmlContent = line.replace(/>/, `${dataLineAttr}>`) + "\n";
    }
    // 检查是否是单行的HTML块
    const singleLineHtmlMatch = trimmedLine.match(htmlBlockStartRegex);
    if (singleLineHtmlMatch) {
      const tagName = singleLineHtmlMatch[1];
      const endTagRegex = new RegExp(`<\/${tagName}\\s*>$`);
      if (endTagRegex.test(trimmedLine)) {
        currentStatus.inHtmlBlock = false;
        root.children.push({
          type: "html",
          value: trimmedLine,
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
      }
    }
    return true;
  }

  // 如果在HTML块内
  if (currentStatus.inHtmlBlock) {
    currentStatus.htmlContent += line + "\n";
    // 检查是否是HTML块的结束
    if (htmlBlockEndRegex.test(trimmedLine)) {
      currentStatus.inHtmlBlock = false;
      root.children.push({
        type: "html",
        value: currentStatus.htmlContent.trim(),
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
    return true;
  }
};
