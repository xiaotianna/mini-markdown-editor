import { tokenizer } from "./tokenizer";
import type { RootTokens } from "../../types/tokens";
import { parseIncrementally } from "./parseIncrementally";

export interface IncrementalParseOptions {
  prevMarkdown?: string;
  prevRoot?: RootTokens;
}

// 语法分析
export const parseMarkdown = (markdown: string, options?: IncrementalParseOptions): RootTokens => {
  const lines = markdown.split("\n");
  // 如果有增量解析选项且存在前一个解析结果
  if (options?.prevMarkdown && options?.prevRoot) {
    return parseIncrementally(markdown, lines, options);
  }

  // 如果没有增量解析选项，执行完整解析
  const root: RootTokens = {
    type: "root",
    children: [],
    position: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: lines.length, column: 1, offset: markdown.length },
    },
  };
  // 语法解析（词法分析器）
  tokenizer(lines, root);
  return root;
};
