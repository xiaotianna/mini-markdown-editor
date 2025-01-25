import type { RootTokens } from "../../types/tokens";
import { parseMap, defaultParse } from "./compose";

// 词法分析器
export const tokenizer = (lines: string[], root: RootTokens) => {
  if (!Array.isArray(lines)) {
    return new Error("The lines parameter is not an array");
  }

  let currentOffset = 0;
  let currentStatus = {
    // heading 的层级
    depth: 0,
    // 当前的 blockquote
    currentBlockquote: null,
    // code
    inCodeBlock: false,
    codeBlockLang: "",
    codeBlockValue: "",
    codeBlockStartOffset: 0,
    codeBlockStartLine: 0,
    // list
    currentList: null,
    currentListItem: null,
    currentIndent: 0,
    listStack: [], // 用于存储列表栈
    // table
    currentTable: null,
  };
  const resetCurrentStatus = () => {
    currentStatus = {
      depth: 0,
      currentBlockquote: null,
      inCodeBlock: false,
      codeBlockLang: "",
      codeBlockValue: "",
      codeBlockStartOffset: 0,
      codeBlockStartLine: 0,
      currentList: null,
      currentListItem: null,
      currentIndent: 0,
      listStack: [],
      currentTable: null,
    };
  };

  // 遍历每一行
  lines.forEach((line, index) => {
    // 去除首尾空格
    const trimmedLine = line.trim();

    // 是否继续转换
    let isParse = false;
    // TODO: 动态调整解析器顺序以优化性能？
    for (const [key, parseFn] of Object.entries(parseMap)) {
      const result = parseFn({
        trimmedLine,
        line,
        lines,
        currentOffset,
        index,
        root,
        currentStatus,
        resetCurrentStatus,
      });

      if (result) {
        // 获取最后添加的节点类型
        const lastNode = root.children[root.children.length - 1];
        if (lastNode) {
          // 根据不同类型的节点重置状态
          if (lastNode.type !== "list" && lastNode.type !== "listItem") {
            currentStatus.currentList = null;
            currentStatus.listStack = [];
            currentStatus.currentListItem = null;
            currentStatus.currentIndent = 0;
          }

          if (lastNode.type !== "blockquote") {
            currentStatus.currentBlockquote = null;
          }

          if (lastNode.type !== "heading") {
            currentStatus.depth = 0;
          }

          if (lastNode.type !== "table") {
            currentStatus.currentTable = null;
          }

          if (lastNode.type !== "code") {
            currentStatus.inCodeBlock = false;
            currentStatus.codeBlockLang = "";
            currentStatus.codeBlockValue = "";
            currentStatus.codeBlockStartOffset = 0;
            currentStatus.codeBlockStartLine = 0;
          }
        }

        isParse = true;
        break;
      }
    }
    if (!isParse) {
      // 如果没有特殊解析，则清空状态
      resetCurrentStatus();
      defaultParse({
        trimmedLine,
        line,
        lines,
        currentOffset,
        index,
        root,
        currentStatus,
        resetCurrentStatus,
      });
    }
    currentOffset += line.length + 1;
  });
};
