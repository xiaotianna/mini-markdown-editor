import type { Tokens } from "@/types/tokens";
import type { ParseFnParams } from "..";
import { parseInlineElements } from "../inline";
import { TokenTypeVal } from "@/types/tokens-types";

// 转换 list
export const parseList = ({
  line,
  lines,
  index,
  currentStatus,
  root,
  resetCurrentStatus,
}: ParseFnParams) => {
  // 检查是否存在列表中断
  if (currentStatus.currentList && index > 0) {
    const prevLine = lines[index - 1].trimStart();
    const isPrevLineList = /^(-|\d+\.)\s+.*/.test(prevLine);
    const isCurrentLineEmpty = line.trim() === "";

    // 如果前一行是列表项，但当前行是空行或非列表项，则重置列表状态
    if (isPrevLineList && (isCurrentLineEmpty || !line.trimStart().match(/^(-|\d+\.)\s+.*/))) {
      resetCurrentStatus();
    }
  }

  // 列表项处理
  const trimmedLine = line.trimStart();
  let indent = line.length - trimmedLine.length;
  const match = trimmedLine.match(/^(-|\d+\.)\s+(.*)/);
  if (match) {
    const [_, marker, content] = match;
    const ordered = marker.includes("."); // 是否有序列表
    const startOffset = calculateOffset(index + 1, indent + 1, lines); // 列表项开始偏移量
    const contentStartOffset = calculateOffset(index + 1, indent + marker.length + 1, lines); // 列表项内容开始偏移量
    const contentEndOffset = contentStartOffset + content.length; // 列表项内容结束偏移量

    // 解析行内元素
    const children = parseInlineElements(content, index, contentStartOffset);

    const listItem = {
      type: "listItem",
      spread: false,
      checked: null,
      children: [
        {
          type: "paragraph",
          children: children,
          position: {
            start: {
              line: index + 1,
              column: indent + marker.length + 1,
              offset: contentStartOffset,
            },
            end: {
              line: index + 1,
              column: indent + marker.length + 1 + content.length,
              offset: contentEndOffset,
            },
          },
        },
      ],
      position: {
        start: {
          line: index + 1,
          column: indent + 1,
          offset: startOffset,
        },
        end: {
          line: index + 1,
          column: indent + marker.length + 1 + content.length,
          offset: contentEndOffset,
        },
      },
    };

    if (indent > currentStatus.currentIndent) {
      if (currentStatus.currentListItem) {
        // 标准化缩进级别，确保每级缩进为2个空格
        const indentLevel = Math.floor((indent - currentStatus.currentIndent) / 2);
        indent = currentStatus.currentIndent + indentLevel * 2;

        // 检查当前列表项是否已经包含子列表
        const existingList = currentStatus.currentListItem.children?.find(
          (child) => child.type === "list",
        );
        if (!existingList) {
          const newList = {
            type: "list",
            ordered,
            start: null,
            spread: false,
            children: [],
            position: listItem.position,
          };
          currentStatus.currentListItem.children?.push(newList as Tokens);
          currentStatus.listStack.push(currentStatus.currentList as Tokens);
          currentStatus.currentList = newList as Tokens;
        } else {
          // 如果已存在子列表，但类型不同，则创建新的列表
          if (existingList.ordered !== ordered) {
            const newList = {
              type: "list",
              ordered,
              start: null,
              spread: false,
              children: [],
              position: listItem.position,
            };
            currentStatus.currentListItem.children?.push(newList as Tokens);
            currentStatus.listStack.push(currentStatus.currentList as Tokens);
            currentStatus.currentList = newList as Tokens;
          } else {
            currentStatus.currentList = existingList as Tokens;
          }
        }
        currentStatus.currentList?.children?.push(listItem as Tokens);
      }
    } else if (indent < currentStatus.currentIndent) {
      // 回到合适的父级列表
      while (
        currentStatus.listStack.length > 0 &&
        currentStatus.listStack[currentStatus.listStack.length - 1]?.position.start.column > indent
      ) {
        currentStatus.currentList = currentStatus.listStack.pop() as Tokens;
      }

      if (currentStatus.currentList) {
        // 检查当前列表类型是否匹配
        if (currentStatus.currentList.ordered !== ordered) {
          // 创建新的同级列表
          const newList = {
            type: "list",
            ordered,
            start: null,
            spread: false,
            children: [listItem],
            position: listItem.position,
          } as Tokens;
          root.children.push(newList);
          currentStatus.currentList = newList;
        } else {
          currentStatus.currentList.children?.push(listItem as Tokens);
        }
      } else {
        // 创建新的根级列表
        root.children.push({
          type: "list" as TokenTypeVal,
          ordered,
          start: null,
          spread: false,
          children: [listItem],
          position: listItem.position,
        } as Tokens);
        currentStatus.currentList = root.children[root.children.length - 1];
      }
    } else {
      // 如果当前列表类型与新列表项类型不同，则创建新的列表节点
      if (currentStatus.currentList && currentStatus.currentList.ordered !== ordered) {
        // 完全重置列表状态
        resetCurrentStatus();
        // 创建新的根级列表
        const newList = {
          type: "list",
          ordered,
          start: null,
          spread: false,
          children: [listItem],
          position: listItem.position,
        } as Tokens;
        root.children.push(newList);
        currentStatus.currentList = newList;
      } else if (!currentStatus.currentList) {
        const newList = {
          type: "list",
          ordered,
          start: null,
          spread: false,
          children: [listItem],
          position: listItem.position,
        } as Tokens;
        root.children.push(newList);
        currentStatus.currentList = newList;
      } else {
        currentStatus.currentList.children?.push(listItem as Tokens);
        // 更新父列表的结束位置
        currentStatus.currentList.position.end = listItem.position.end;
      }
    }

    // 更新当前状态
    currentStatus.currentListItem = listItem as Tokens;
    currentStatus.currentIndent = indent;
    return true;
  }
};

// 辅助函数：计算偏移量
const calculateOffset = (index: number, column: number, lines: string[]) => {
  let offset = 0;
  for (let i = 0; i < index - 1; i++) {
    offset += lines[i].length + 1; // +1 是因为换行符
  }
  return offset + column - 1;
};
