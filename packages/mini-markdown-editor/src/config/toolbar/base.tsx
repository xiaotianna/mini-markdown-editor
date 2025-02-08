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
import UndoIcon from "@/assets/images/undo.svg?raw";
import RedoIcon from "@/assets/images/redo.svg?raw";
import { InsertTextEvent, RedoEvent, UndoEvent } from "./event";
import { ToolbarItem } from "@/types/toolbar";
// 组件
import Upload from "@/components/Toolbar/Upload";
import FullScreen from "@/components/Toolbar/FullScreen";
import { Contents, Read, Write, Help, Output } from "@/components/Toolbar/ShowLayout";
import Emoji from "@/components/Toolbar/Emoji";
import Save from "@/components/Toolbar/Save";
// 快捷键描述
import { Hotkey } from "@/common/hotkeys";

export const toolbar: ToolbarItem[] = [
  {
    type: "heading",
    icon: HeadingIcon,
    title: "标题",
    list: [
      {
        title: "H1 一级标题",
        type: "heading-1",
        hotkey: Hotkey.TITLE.FIRST.toConfig(),
        onClick: () => InsertTextEvent("heading-1"),
      },
      {
        title: "H2 二级标题",
        type: "heading-2",
        hotkey: Hotkey.TITLE.SECOND.toConfig(),
        onClick: () => InsertTextEvent("heading-2"),
      },
      {
        title: "H3 三级标题",
        type: "heading-3",
        hotkey: Hotkey.TITLE.THIRD.toConfig(),
        onClick: () => InsertTextEvent("heading-3"),
      },
      {
        title: "H4 四级标题",
        type: "heading-4",
        hotkey: Hotkey.TITLE.FOURTH.toConfig(),
        onClick: () => InsertTextEvent("heading-4"),
      },
      {
        title: "H5 五级标题",
        type: "heading-5",
        hotkey: Hotkey.TITLE.FIFTH.toConfig(),
        onClick: () => InsertTextEvent("heading-5"),
      },
      {
        title: "H6 六级标题",
        type: "heading-6",
        hotkey: Hotkey.TITLE.SIXTH.toConfig(),
        onClick: () => InsertTextEvent("heading-6"),
      },
    ],
  },
  {
    type: "bold",
    icon: BoldIcon,
    title: "加粗",
    description: Hotkey.BOLD.readableCommand,
    hotkey: Hotkey.BOLD.toConfig(),
    onClick: () => InsertTextEvent("bold"),
  },
  {
    type: "italic",
    icon: ItalicIcon,
    title: "斜体",
    description: Hotkey.ITALIC.readableCommand,
    hotkey: Hotkey.ITALIC.toConfig(),
    onClick: () => InsertTextEvent("italic"),
  },
  {
    type: "underline",
    icon: UnderlineIcon,
    title: "下划线",
    description: Hotkey.UNDERLINE.readableCommand,
    hotkey: Hotkey.UNDERLINE.toConfig(),
    onClick: () => InsertTextEvent("underline"),
  },
  {
    type: "delete",
    icon: DeleteIcon,
    title: "删除线",
    description: Hotkey.DELETE.readableCommand,
    hotkey: Hotkey.DELETE.toConfig(),
    onClick: () => InsertTextEvent("delete"),
  },
  {
    type: "line",
  },
  {
    type: "blockquote",
    icon: BlockquoteIcon,
    title: "引用",
    description: Hotkey.BLOCKQUOTE.readableCommand,
    hotkey: Hotkey.BLOCKQUOTE.toConfig(),
    onClick: () => InsertTextEvent("blockquote"),
  },
  {
    type: "ul",
    icon: UlIcon,
    title: "无序列表",
    description: Hotkey.UNORDERED_LIST.readableCommand,
    hotkey: Hotkey.UNORDERED_LIST.toConfig(),
    onClick: () => InsertTextEvent("ul"),
  },
  {
    type: "ol",
    icon: OlIcon,
    title: "有序列表",
    description: Hotkey.ORDERED_LIST.readableCommand,
    hotkey: Hotkey.ORDERED_LIST.toConfig(),
    onClick: () => InsertTextEvent("ol"),
  },
  {
    type: "inlinecode",
    icon: InlineCodeIcon,
    title: "行内代码",
    description: Hotkey.INLINE_CODE.readableCommand,
    hotkey: Hotkey.INLINE_CODE.toConfig(),
    onClick: () => InsertTextEvent("inlinecode"),
  },
  {
    type: "code",
    icon: CodeIcon,
    title: "代码块",
    description: Hotkey.CODE_BLOCK.readableCommand,
    hotkey: Hotkey.CODE_BLOCK.toConfig(),
    onClick: () => InsertTextEvent("code"),
  },
  {
    type: "link",
    icon: LinkIcon,
    title: "链接",
    description: Hotkey.LINK.readableCommand,
    hotkey: Hotkey.LINK.toConfig(),
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
        hotkey: Hotkey.LINK.toConfig(),
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
    description: Hotkey.TABLE.readableCommand,
    hotkey: Hotkey.TABLE.toConfig(),
    onClick: () => InsertTextEvent("table"),
  },
  {
    type: "emoji",
    component: <Emoji />,
  },
  {
    type: "line",
  },
  {
    type: "undo",
    icon: UndoIcon,
    title: "撤销",
    description: Hotkey.UNDO.readableCommand,
    onClick: () => UndoEvent(),
  },
  {
    type: "redo",
    icon: RedoIcon,
    title: "重做",
    description: Hotkey.REDO.readableCommand,
    onClick: () => RedoEvent(),
  },
  {
    type: "line",
  },
  {
    type: "fullscreen",
    hotkey: Hotkey.FULL_SCREEN.toConfig(),
    component: <FullScreen />,
  },
  {
    type: "save",
    hotkey: Hotkey.SAVE.toConfig(),
    component: <Save />,
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
