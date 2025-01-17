import type { TokenTypeVal } from '@/types/tokens-types'
import type { RootTokens, Tokens } from '@/types/tokens'
import { parseHeading } from './heading'
import { parseBlod } from './blod'
import { parseItalic } from './italic'
import { parseUnderline } from './underline'
import { parseDelete } from './delete'
import { parseBlockquote } from './blockquote'
import { parseLink } from './link'
import { parseImage } from './image'
import { parseInlineCode } from './inlineCode'
import { parseThematicBreak } from './thematicBreak'

const blocks: Partial<BlocksMap> = {
  heading: parseHeading,
  blod: parseBlod, // 加粗
  italic: parseItalic, // 斜体
  underline: parseUnderline, // 下划线
  delete: parseDelete, // 删除线
  blockquote: parseBlockquote, // 引用
  link: parseLink, // 链接
  image: parseImage, // 图片
  inlineCode: parseInlineCode, // 行内高亮
  thematicBreak: {
    parse: parseThematicBreak,
    enforce: 'pre'
  }, // 分割线
  // code: parseCode // 代码块
  // list: parseList // 列表
  // listItem: parseItem, // 列表项
  // html: parseHtml, // html 标签
  // table: parseTable, // 表格
  // thead: parseThead, // 表格头部
  // tbody: parseTbody, // 表格主体
  // tr: parseTr, // 表格行
  // th: parseTh, // 表格头部列单元格
  // td: parseTd, // 表格主体列单元格
}

export type BlockFnParams = {
  trimmedLine: string
  index: number
  currentOffset: number
  root: RootTokens
  currentStatus: {
    currentBlockquote: Tokens | null
    currentList: Tokens | null
    currentListItem: Tokens | null
  }
}

type BlocksMap = {
  [key in TokenTypeVal]: {
    /**
     * 解析执行顺序，并且 parse 需要返回 boolean，默认为 none
     * 如果为 pre：则优先解析，并且不会解析其他块级元素
     */
    enforce: 'pre' | 'none'
    parse: (params: BlockFnParams) => boolean
  } | ((params: BlockFnParams) => void)
}

export { blocks as blocksParser }
