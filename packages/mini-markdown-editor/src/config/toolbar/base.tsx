// icon
import HeadingIcon from "@/assets/images/heading.svg?raw";
import BoldIcon from "@/assets/images/bold.svg?raw";
import ItalicIcon from "@/assets/images/italic.svg?raw";
import UnderlineIcon from "@/assets/images/underline.svg?raw";
import DeleteIcon from "@/assets/images/delete.svg?raw";
import BlockquoteIcon from "@/assets/images/blockquote.svg?raw";
import UlIcon from "@/assets/images/ul.svg?raw";
import OlIcon from "@/assets/images/ol.svg?raw";
import InlineCodeIcon from "@/assets/images/inlinecode.svg?raw";
import CodeIcon from "@/assets/images/code.svg?raw";
import LinkIcon from "@/assets/images/link.svg?raw";
import ImageIcon from "@/assets/images/image.svg?raw";
import TableIcon from "@/assets/images/table.svg?raw";
import Undo from "@/assets/images/undo.svg?raw";
import Redo from "@/assets/images/redo.svg?raw";
import { InsertTextEvent, RedoEvent, UndoEvent } from "./event";
import { ToolbarItem } from "@/types/toolbar";
// 组件
import Upload from "@/components/Toolbar/Upload";
import FullScreen from "@/components/Toolbar/FullScreen";
import { Contents, Read, Write, Help, Output } from "@/components/Toolbar/ShowLayout";

export const toolbar: ToolbarItem[] = [
  {
    type: "heading",
    icon: HeadingIcon,
    title: "标题",
    list: [
      {
        title: "H1 一级标题",
        type: "heading-1",
        onClick: () => InsertTextEvent("heading-1"),
      },
      {
        title: "H2 二级标题",
        type: "heading-2",
        onClick: () => InsertTextEvent("heading-2"),
      },
      {
        title: "H3 三级标题",
        type: "heading-3",
        onClick: () => InsertTextEvent("heading-3"),
      },
      {
        title: "H4 四级标题",
        type: "heading-4",
        onClick: () => InsertTextEvent("heading-4"),
      },
      {
        title: "H5 五级标题",
        type: "heading-5",
        onClick: () => InsertTextEvent("heading-5"),
      },
      {
        title: "H6 六级标题",
        type: "heading-6",
        onClick: () => InsertTextEvent("heading-6"),
      },
    ],
  },
  {
    type: "bold",
    icon: BoldIcon,
    title: "加粗",
    onClick: () => InsertTextEvent("bold"),
  },
  {
    type: "italic",
    icon: ItalicIcon,
    title: "斜体",
    onClick: () => InsertTextEvent("italic"),
  },
  {
    type: "underline",
    icon: UnderlineIcon,
    title: "下划线",
    onClick: () => InsertTextEvent("underline"),
  },
  {
    type: "delete",
    icon: DeleteIcon,
    title: "删除线",
    onClick: () => InsertTextEvent("delete"),
  },
  {
    type: "line",
  },
  {
    type: "blockquote",
    icon: BlockquoteIcon,
    title: "引用",
    onClick: () => InsertTextEvent("blockquote"),
  },
  {
    type: "ul",
    icon: UlIcon,
    title: "无序列表",
    onClick: () => InsertTextEvent("ul"),
  },
  {
    type: "ol",
    icon: OlIcon,
    title: "有序列表",
    onClick: () => InsertTextEvent("ol"),
  },
  {
    type: "inlinecode",
    icon: InlineCodeIcon,
    title: "行内代码",
    onClick: () => InsertTextEvent("inlinecode"),
  },
  {
    type: "code",
    icon: CodeIcon,
    title: "代码块",
    onClick: () => InsertTextEvent("code"),
  },
  {
    type: "link",
    icon: LinkIcon,
    title: "链接",
    onClick: () => InsertTextEvent("link"),
  },
  {
    type: "image",
    icon: ImageIcon,
    title: "图片",
    list: [
      {
        title: "添加链接",
        type: "image-link",
        onClick: () => InsertTextEvent("image-link"),
      },
      {
        title: "上传图片",
        type: "image-upload",
      },
    ],
  },
  {
    type: "table",
    icon: TableIcon,
    title: "表格",
    onClick: () => InsertTextEvent("table"),
  },
  {
    type: "line",
  },
  {
    type: "undo",
    icon: Undo,
    title: "撤销",
    onClick: () => UndoEvent(),
  },
  {
    type: "redo",
    icon: Redo,
    title: "重做",
    onClick: () => RedoEvent(),
  },
  {
    type: "line",
  },
  {
    type: "fullscreen",
    component: <FullScreen />,
  },
  {
    type: "write",
    component: <Write />,
  },
  {
    type: "preview",
    component: <Read />,
  },
  {
    type: "contents",
    component: <Contents />,
  },
  {
    type: "help",
    component: <Help />,
  },
  {
    type: "output",
    component: <Output />,
  },
];

// 渲染列表其他定制节点
export const render = {
  "image-upload": <Upload />,
};
export type renderKey = keyof typeof render;
