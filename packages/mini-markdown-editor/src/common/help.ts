import Heading1 from "@/assets/images/heading-1.svg?raw";
import Heading2 from "@/assets/images/heading-2.svg?raw";
import Heading3 from "@/assets/images/heading-3.svg?raw";
import Bold from "@/assets/images/bold.svg?raw";
import Italic from "@/assets/images/italic.svg?raw";
import Underline from "@/assets/images/underline.svg?raw";
import Delete from "@/assets/images/delete.svg?raw";
import Blockquote from "@/assets/images/blockquote.svg?raw";
import Ul from "@/assets/images/ul.svg?raw";
import Ol from "@/assets/images/ol.svg?raw";
import InlineCode from "@/assets/images/inlinecode.svg?raw";
import Code from "@/assets/images/code.svg?raw";
import Link from "@/assets/images/link.svg?raw";
import Image from "@/assets/images/image.svg?raw";
import ThematicBreak from "@/assets/images/thematic-break.svg?raw";

// markdown语法规则
export const grammar = [
  {
    title: "一级标题",
    icon: Heading1,
    rule: "# heading",
  },
  {
    title: "二级标题",
    icon: Heading2,
    rule: "## heading",
  },
  {
    title: "三级标题",
    icon: Heading3,
    rule: "### heading",
  },
  // {
  //   title: "四级标题",
  //   icon: Heading4,
  //   rule: "#### heading",
  // },
  // {
  //   title: "五级标题",
  //   icon: Heading5,
  //   rule: "##### heading",
  // },
  // {
  //   title: "六级标题",
  //   icon: Heading6,
  //   rule: "###### heading",
  // },
  {
    title: "加粗",
    icon: Bold,
    rule: "**bold text**",
  },
  {
    title: "斜体",
    icon: Italic,
    rule: "_italic text_",
  },
  {
    title: "下划线",
    icon: Underline,
    rule: "--underline text--",
  },
  {
    title: "删除线",
    icon: Delete,
    rule: "~~delete text~~",
  },
  {
    title: "引用",
    icon: Blockquote,
    rule: "> quoted text",
  },
  {
    title: "无序列表",
    icon: Ul,
    rule: "- item",
  },
  {
    title: "有序列表",
    icon: Ol,
    rule: "1. item",
  },
  {
    title: "内联代码",
    icon: InlineCode,
    rule: "`code`",
  },
  {
    title: "代码块",
    icon: Code,
    rule: "```lang↵",
  },
  {
    title: "链接",
    icon: Link,
    rule: "[link text](url)",
  },
  {
    title: "图片",
    icon: Image,
    rule: "![alt](url)",
  },
  {
    title: "分割线",
    icon: ThematicBreak,
    rule: "---",
  },
];

const isMac = /Mac/.test(navigator.userAgent);

// 快捷键
export const shortcuts = [
  {
    title: "加粗",
    icon: Bold,
    rule: isMac ? "Cmd + B" : "Ctrl + B",
  },
  {
    title: "斜体",
    icon: Italic,
    rule: isMac ? "Cmd + I" : "Ctrl + I",
  },
  {
    title: "下划线",
    icon: Underline,
    rule: isMac ? "Cmd + U" : "Ctrl + U",
  },
  {
    title: "删除线",
    icon: Delete,
    rule: isMac ? "Cmd + D" : "Ctrl + D",
  },
];
