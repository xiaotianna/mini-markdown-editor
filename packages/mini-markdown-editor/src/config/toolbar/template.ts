import { ToolbarType } from "@/types/toolbar";

export type TemplateType = Partial<Record<ToolbarType, TemplateVal>>;

export type TemplateVal = {
  content: string;

  selection: {
    anchor: number;
    head: number;
  };
};

const template: TemplateType = {
  "heading-1": {
    content: `# `,
    selection: {
      // anchor === head 不框选内容
      anchor: 0, // 光标起始位置
      head: 2, // 光标结束位置
    },
  },
  "heading-2": {
    content: `## `,
    selection: {
      anchor: 0,
      head: 3,
    },
  },
  "heading-3": {
    content: `### `,
    selection: {
      anchor: 0,
      head: 4,
    },
  },
  "heading-4": {
    content: `#### `,
    selection: {
      anchor: 0,
      head: 5,
    },
  },
  "heading-5": {
    content: `##### `,
    selection: {
      anchor: 0,
      head: 6,
    },
  },
  "heading-6": {
    content: `###### `,
    selection: {
      anchor: 0,
      head: 7,
    },
  },
  bold: {
    content: `****`,
    selection: {
      anchor: 2,
      head: 2,
    },
  },
  italic: {
    content: `__`,
    selection: {
      anchor: 1,
      head: 1,
    },
  },
  underline: {
    content: `----`,
    selection: {
      anchor: 1,
      head: 1,
    },
  },
  delete: {
    content: `~~~~`,
    selection: {
      anchor: 2,
      head: 2,
    },
  },
  blockquote: {
    content: `> `,
    selection: {
      anchor: 2,
      head: 2,
    },
  },
  ul: {
    content: `- `,
    selection: {
      anchor: 2,
      head: 2,
    },
  },
  ol: {
    content: `1. `,
    selection: {
      anchor: 2,
      head: 2,
    },
  },
  inlinecode: {
    content: "``",
    selection: {
      anchor: 1,
      head: 1,
    },
  },
  code: {
    content: "```\n\n```",
    selection: {
      anchor: 3,
      head: 3,
    },
  },
  "image-link": {
    content: `![](URL)`,
    selection: {
      anchor: 4,
      head: 7,
    },
  },
  link: {
    content: `[]()`,
    selection: {
      anchor: 1,
      head: 1,
    },
  },
  table: {
    content: `|  表头  |  表头  |\n| ----- | ----- |\n| 单元格 | 单元格 |`,
    selection: {
      anchor: 3,
      head: 5,
    },
  },
};

export { template };
