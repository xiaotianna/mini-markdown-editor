import { Tokens } from "@/types/tokens";
import { TokenTypeVal } from "@/types/tokens-types";

interface MarkdownPattern {
  regex: RegExp;
  process: (match: RegExpMatchArray, context: ProcessContext) => Tokens;
}

interface ProcessContext {
  line: string;
  index: number;
  offset: number;
  currentOffset: number;
  parseInlineElements: (line: string, index: number, currentOffset: number) => Tokens[];
}

// 定义所有 Markdown 模式
const MARKDOWN_PATTERNS: Record<string, MarkdownPattern> = {
  bold: {
    regex: /\*\*(?<content>.*?)\*\*/,
    process: (match, context) => createStandardToken("bold" as TokenTypeVal, match, context),
  },
  italic: {
    regex: /\_(?<content>.*?)\_/,
    process: (match, context) => createStandardToken("italic" as TokenTypeVal, match, context),
  },
  underline: {
    regex: /\-{2}(?<content>.*?)\-{2}/,
    process: (match, context) => createStandardToken("underline" as TokenTypeVal, match, context),
  },
  delete: {
    regex: /\~{2}(?<content>.*?)\~{2}/,
    process: (match, context) => createStandardToken("delete" as TokenTypeVal, match, context),
  },
  inlineCode: {
    regex: /`(?<content>.*?)`/,
    process: (match, context) => {
      if (!match[1].trim()) {
        return createTextToken(match[0], match, context);
      }
      return {
        type: "inlineCode",
        children: [createTextToken(match.groups?.content || "", match, context)],
        position: createPosition(match, context),
      };
    },
  },
  image: {
    regex: /!\[(?<alt>.*?)\]\((?<url>.*?)\)/,
    process: (match, context) => ({
      type: "image",
      title: null,
      url: match.groups?.url || "",
      alt: match.groups?.alt || "",
      position: createPosition(match, context),
    }),
  },
  link: {
    regex: /(?<!!)\[(?<text>[^\]]+)\]\((?<url>[^)]+)\)/,
    process: (match, context) => ({
      type: "link",
      title: null,
      url: match.groups?.url || "",
      children: [createTextToken(match.groups?.text || "", match, context)],
      position: createPosition(match, context),
    }),
  },
  html: {
    regex: /<(?<tag>[a-zA-Z0-9]+)(?<attrs>[^>]*)>(?<content>.*?)<\/\1>/g,
    process: (match, context) => ({
      type: "html",
      value: match[0],
      position: createPosition(match, context),
    }),
  },
};

// 创建位置信息
function createPosition(match: RegExpMatchArray, context: ProcessContext) {
  const startOffset = context.currentOffset + context.offset + (match.index ?? 0);
  const endOffset = startOffset + match[0].length;

  return {
    start: {
      line: context.index + 1,
      column: context.offset + (match.index ?? 0) + 1,
      offset: startOffset,
    },
    end: {
      line: context.index + 1,
      column: context.offset + (match.index ?? 0) + match[0].length + 1,
      offset: endOffset,
    },
  };
}

// 创建文本节点
function createTextToken(value: string, match: RegExpMatchArray, context: ProcessContext): Tokens {
  return {
    type: "text",
    value,
    position: createPosition(match, context),
  };
}

// 创建标准内联标记节点
function createStandardToken(
  type: TokenTypeVal,
  match: RegExpMatchArray,
  context: ProcessContext,
): Tokens {
  const innerContent = match.groups?.content || match[1];
  const innerOffset =
    context.currentOffset +
    context.offset +
    (match.index ?? 0) +
    (type === "bold" || type === "delete" ? 2 : 1);

  return {
    type,
    children: context.parseInlineElements(innerContent, context.index, innerOffset),
    position: createPosition(match, context),
  };
}

// 查找最近的匹配
function findNextMatch(line: string, offset: number) {
  let bestMatch: { type: string; match: RegExpMatchArray } | null = null;

  for (const [type, pattern] of Object.entries(MARKDOWN_PATTERNS)) {
    const match = line.slice(offset).match(pattern.regex);
    if (!match) continue;

    if (!bestMatch || (match.index ?? Infinity) < (bestMatch.match.index ?? Infinity)) {
      bestMatch = { type, match };
    }
  }

  return bestMatch;
}

export const parseInlineElements = (
  line: string,
  index: number,
  currentOffset: number,
): Tokens[] => {
  let offset = 0;
  let children: Tokens[] = [];
  let lastIndex = 0;

  const context: ProcessContext = {
    line,
    index,
    currentOffset,
    offset,
    parseInlineElements,
  };

  while (offset < line.length) {
    const nextMatch = findNextMatch(line, offset);

    if (!nextMatch) break;

    const { type, match } = nextMatch;

    // 处理匹配前的文本
    if (match.index && match.index > 0) {
      children.push({
        type: "text",
        value: line.slice(offset, offset + match.index),
        position: {
          start: {
            line: index + 1,
            column: offset + 1,
            offset: currentOffset + offset,
          },
          end: {
            line: index + 1,
            column: offset + match.index + 1,
            offset: currentOffset + offset + match.index,
          },
        },
      });
    }

    // 处理匹配的标记
    context.offset = offset;
    children.push(MARKDOWN_PATTERNS[type].process(match, context));

    offset += (match.index ?? 0) + match[0].length;
    lastIndex = offset;
  }

  // 处理剩余文本
  if (lastIndex < line.length) {
    children.push({
      type: "text",
      value: line.slice(lastIndex),
      position: {
        start: {
          line: index + 1,
          column: lastIndex + 1,
          offset: currentOffset + lastIndex,
        },
        end: {
          line: index + 1,
          column: line.length + 1,
          offset: currentOffset + line.length,
        },
      },
    });
  }

  return children;
};
