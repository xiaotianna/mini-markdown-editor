import type { ToolbarItem, ToolbarType } from "@/types/toolbar"
import HeadingIcon from "@/assets/images/heading.svg"
import BoldIcon from "@/assets/images/bold.svg"
import ItalicIcon from "@/assets/images/italic.svg"
import UnderlineIcon from "@/assets/images/underline.svg"
import DeleteIcon from "@/assets/images/delete.svg"
import BlockquoteIcon from "@/assets/images/blockquote.svg"
import UlIcon from "@/assets/images/ul.svg"
import OlIcon from "@/assets/images/ol.svg"
import InlineCodeIcon from "@/assets/images/inlinecode.svg"
import CodeIcon from "@/assets/images/code.svg"
import LinkIcon from "@/assets/images/link.svg"
import ImageIcon from "@/assets/images/image.svg"
import TableIcon from "@/assets/images/table.svg"
import Undo from "@/assets/images/undo.svg"
import Redo from "@/assets/images/redo.svg"
import FullscreenIcon from "@/assets/images/fullscreen.svg"
import WriteIcon from "@/assets/images/write.svg"
import PreviewIcon from "@/assets/images/perview.svg"
import ContentsIcon from "@/assets/images/contents.svg"
import HtmlIcon from "@/assets/images/html.svg"
import OutputPDFIcon from "@/assets/images/output-pdf.svg"

class ToolbarConfig {
  private toolbars: ToolbarItem[]

  constructor() {
    this.toolbars = this.initToolbars()
  }

  // 初始化工具栏内容
  private initToolbars(): ToolbarItem[] {
    return [
      {
        type: "heading",
        icon: HeadingIcon,
        title: "标题",
      },
      {
        type: "bold",
        icon: BoldIcon,
        title: "加粗",
      },
      {
        type: "italic",
        icon: ItalicIcon,
        title: "斜体",
      },
      {
        type: "underline",
        icon: UnderlineIcon,
        title: "下划线",
      },
      {
        type: "delete",
        icon: DeleteIcon,
        title: "删除线",
      },
      {
        type: "line",
      },
      {
        type: "blockquote",
        icon: BlockquoteIcon,
        title: "引用",
      },
      {
        type: "ul",
        icon: UlIcon,
        title: "无序列表",
      },
      {
        type: "ol",
        icon: OlIcon,
        title: "有序列表",
      },
      {
        type: "inlinecode",
        icon: InlineCodeIcon,
        title: "行内代码",
      },
      {
        type: "code",
        icon: CodeIcon,
        title: "代码块",
      },
      {
        type: "link",
        icon: LinkIcon,
        title: "链接",
      },
      {
        type: "image",
        icon: ImageIcon,
        title: "图片",
      },
      {
        type: "table",
        icon: TableIcon,
        title: "表格",
      },
      {
        type: "line",
      },
      {
        type: "undo",
        icon: Undo,
        title: "撤销",
      },
      {
        type: "redo",
        icon: Redo,
        title: "重做",
      },
      {
        type: "line",
      },
      {
        type: "fullscreen",
        icon: FullscreenIcon,
        title: "全屏",
      },
      {
        type: "write",
        icon: WriteIcon,
        title: "只写",
      },
      {
        type: "preview",
        icon: PreviewIcon,
        title: "仅预览",
      },
      {
        type: "contents",
        icon: ContentsIcon,
        title: "目录",
      },
      {
        type: "html",
        icon: HtmlIcon,
        title: "HTML代码预览",
      },
      {
        type: "pdf",
        icon: OutputPDFIcon,
        title: "导出为PDF",
      },
    ]
  }

  // 获取所有工具栏项
  public getAllToolbars(): ToolbarItem[] {
    return this.toolbars
  }

  public addToolbar(toolbarItem: ToolbarItem): void {
    this.toolbars.push(toolbarItem)
  }

  public removeToolbar(type: ToolbarType): void {
    const index = this.toolbars.findIndex((toolbar) => toolbar.type === type)
    if (index !== -1) {
      this.toolbars.splice(index, 1)
    }
  }

  public updateToolbar(
    type: ToolbarType,
    newConfig: Partial<ToolbarItem>
  ): void {
    const index = this.toolbars.findIndex((toolbar) => toolbar.type === type)
    if (index !== -1) {
      this.toolbars[index] = { ...this.toolbars[index], ...newConfig }
    }
  }

  // TODO: 添加重新排序工具栏顺序（例如拖拽排序？？）的方法
  public reorderToolbars(newOrder: ToolbarType[]): void {
    const toolbarMap = new Map(
      this.toolbars.map((toolbar) => [toolbar.type, toolbar])
    )
    this.toolbars = newOrder
      .map((type) => toolbarMap.get(type))
      .filter((toolbar): toolbar is ToolbarItem => toolbar !== undefined)
  }
}

export const toolbarConfig = new ToolbarConfig()
