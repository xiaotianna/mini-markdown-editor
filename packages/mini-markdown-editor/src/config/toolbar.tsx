// 工具栏图标
import HeadingIcon from '@/assets/images/heading.svg'
import BlodIcon from '@/assets/images/blod.svg'
import ItalicIcon from '@/assets/images/italic.svg'
import UnderlineIcon from '@/assets/images/underline.svg'
import DeleteIcon from '@/assets/images/delete.svg'
import BlockquoteIcon from '@/assets/images/blockquote.svg'
import UlIcon from '@/assets/images/ul.svg'
import OlIcon from '@/assets/images/ol.svg'
import InlineCodeIcon from '@/assets/images/inlinecode.svg'
import CodeIcon from '@/assets/images/code.svg'
import LinkIcon from '@/assets/images/link.svg'
import ImageIcon from '@/assets/images/image.svg'
import TableIcon from '@/assets/images/table.svg'
import Undo from '@/assets/images/undo.svg'
import Redo from '@/assets/images/redo.svg'
import FullscreenIcon from '@/assets/images/fullscreen.svg'
import WriteIcon from '@/assets/images/write.svg'
import PreviewIcon from '@/assets/images/perview.svg'
import ContentsIcon from '@/assets/images/contents.svg'
import HtmlIcon from '@/assets/images/html.svg'
import OutputPDFIcon from '@/assets/images/output-pdf.svg'

// 渲染 工具栏 配置
export const toolbars = [
  {
    type: 'heading',
    icon: HeadingIcon,
    title: '标题',
    list: []
  },
  {
    type: 'blod',
    icon: BlodIcon,
    title: '加粗'
  },
  {
    type: 'italic',
    icon: ItalicIcon,
    title: '斜体'
  },
  {
    type: 'underline',
    icon: UnderlineIcon,
    title: '下划线'
  },
  {
    type: 'delete',
    icon: DeleteIcon,
    title: '删除线'
  },
  {
    type: 'line'
  },
  {
    type: 'blockquote',
    icon: BlockquoteIcon,
    title: '引用'
  },
  {
    type: 'ul',
    icon: UlIcon,
    title: '无序列表'
  },
  {
    type: 'ol',
    icon: OlIcon,
    title: '有序列表'
  },
  {
    type: 'inlinecode',
    icon: InlineCodeIcon,
    title: '行内代码'
  },
  {
    type: 'code',
    icon: CodeIcon,
    title: '代码块'
  },
  {
    type: 'link',
    icon: LinkIcon,
    title: '链接'
  },
  {
    type: 'image',
    icon: ImageIcon,
    title: '图片'
  },
  {
    type: 'table',
    icon: TableIcon,
    title: '表格'
  },
  {
    type: 'line'
  },
  {
    type: 'undo',
    icon: Undo,
    title: '撤销'
  },
  {
    type: 'redo',
    icon: Redo,
    title: '重做'
  },
  {
    type: 'line'
  },
  {
    type: 'fullscreen',
    icon: FullscreenIcon,
    title: '全屏'
  },
  {
    type: 'write',
    icon: WriteIcon,
    title: '只写'
  },
  {
    type: 'preview',
    icon: PreviewIcon,
    title: '仅预览'
  },
  {
    type: 'contents',
    icon: ContentsIcon,
    title: '目录'
  },
  {
    type: 'html',
    icon: HtmlIcon,
    title: 'HTML代码预览'
  },
  {
    type: 'pdf',
    icon: OutputPDFIcon,
    title: '导出为PDF'
  }
]
