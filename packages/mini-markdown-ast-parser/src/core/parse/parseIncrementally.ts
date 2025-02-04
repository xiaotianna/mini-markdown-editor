import { RootTokens } from "@/types/tokens";
import { IncrementalParseOptions } from ".";
import { tokenizer } from "./tokenizer";

// 增量解析方法
export const parseIncrementally = (
  markdown: string,
  lines: string[],
  options: IncrementalParseOptions,
): RootTokens => {
  const prevLines = options.prevMarkdown?.split("\n") || [];
  // 找到所有变化的区间
  const changeRanges: { start: number; end: number }[] = [];
  let currentRange: { start: number; end: number } | null = null;

  // 遍历所有行，找出所有变化的区间
  for (let i = 0; i < Math.max(lines.length, prevLines.length); i++) {
    const isLineDifferent = lines[i] !== prevLines[i];

    if (isLineDifferent && !currentRange) {
      currentRange = { start: i, end: i + 1 };
    } else if (isLineDifferent && currentRange) {
      currentRange.end = i + 1;
    } else if (!isLineDifferent && currentRange) {
      changeRanges.push(currentRange);
      currentRange = null;
    }
  }

  // 处理最后一个区间
  if (currentRange) {
    changeRanges.push(currentRange);
  }

  // 如果没有变化，直接返回之前的解析结果
  if (changeRanges.length === 0 && options.prevRoot) {
    return options.prevRoot;
  }

  // 如果没有变化但也没有之前的解析结果，创建新的根节点
  if (changeRanges.length === 0) {
    return {
      type: "root",
      children: [],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: lines.length, column: 1, offset: markdown.length },
      },
    };
  }

  // 创建新的根节点
  const root: RootTokens = {
    type: "root",
    children: [],
    position: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: lines.length, column: 1, offset: markdown.length },
    },
  };

  // 复制第一个变化区间之前的节点
  root.children = (options.prevRoot?.children || []).filter(
    (node) => node.position.end.line <= changeRanges[0].start,
  );

  // 处理每个变化区间
  let lastEndLine = changeRanges[0].start;
  for (const range of changeRanges) {
    // 复制区间之间的未变化节点
    if (range.start > lastEndLine && options.prevRoot?.children) {
      const unchangedNodes = options.prevRoot.children.filter(
        (node) => node.position.start.line > lastEndLine && node.position.end.line <= range.start,
      );
      root.children.push(...unchangedNodes);
    }

    // 解析变化的部分
    const changedText = lines.slice(range.start, range.end).join("\n");
    const changedOffset = lines.slice(0, range.start).join("\n").length + (range.start > 0 ? 1 : 0);
    const tempRoot: RootTokens = {
      type: "root",
      children: [],
      position: {
        start: { line: range.start + 1, column: 1, offset: changedOffset },
        end: { line: range.end, column: 1, offset: changedOffset + changedText.length },
      },
    };

    tokenizer(lines.slice(range.start, range.end), tempRoot);
    root.children.push(...tempRoot.children);

    lastEndLine = range.end;
  }

  // 复制最后一个变化区间之后的节点，并调整位置信息
  const lineDiff = lines.length - prevLines.length;
  const remainingNodes = options.prevRoot?.children
    .filter((node) => node.position.start.line > changeRanges[changeRanges.length - 1].end)
    .map((node) => ({
      ...node,
      position: {
        start: {
          ...node.position.start,
          line: node.position.start.line + lineDiff,
        },
        end: {
          ...node.position.end,
          line: node.position.end.line + lineDiff,
        },
      },
    }));

  if (remainingNodes) {
    root.children.push(...remainingNodes);
  }
  return root;
};
