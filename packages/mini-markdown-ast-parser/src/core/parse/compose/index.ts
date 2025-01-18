import type { TokenTypeVal } from '@/types/tokens-types'
import type { RootTokens, Tokens } from '@/types/tokens'
// 行级
// import { parseBlod } from './inline/blod'
// import { parseItalic } from './inline/italic'
// import { parseUnderline } from './inline/underline'
// import { parseDelete } from './inline/delete'
// import { parseLink } from './inline/link'
// import { parseInlineCode } from './inline/inlineCode'
// 块级
import { parseHeading } from './blocks/heading'
import { parseBlockquote } from './blocks/blockquote'
// import { parseImage } from './blocks/image'
import { parseThematicBreak } from './blocks/thematicBreak'
// default
import { parseParagraph } from './blocks/paragraph'

const parseMap: Partial<ParseMapType> = {
  // 行级
  // 块级
  heading: parseHeading, // 标题
  blockquote: parseBlockquote, // 引用
  thematicBreak: parseThematicBreak, // 分割线
}

export const defaultParse = parseParagraph // 默认解析器（段落）

export { parseMap }

export type ParseFnParams = {
  trimmedLine: string
  line: string
  index: number
  currentOffset: number
  root: RootTokens
  currentStatus: {
    depth: number | null
    currentBlockquote: Tokens | null
    currentList: Tokens | null
    currentListItem: Tokens | null
  }
}

type ParseMapType = {
  [key in TokenTypeVal]: (params: ParseFnParams) => boolean | void
}

// const blocks: Partial<BlocksMap> = {
//   heading: parseHeading,
//   blod: parseBlod, // 加粗
//   italic: parseItalic, // 斜体
//   underline: parseUnderline, // 下划线
//   delete: parseDelete, // 删除线
//   blockquote: parseBlockquote, // 引用
//   link: parseLink, // 链接
//   image: parseImage, // 图片
//   inlineCode: parseInlineCode, // 行内高亮
//   thematicBreak: {
//     parse: parseThematicBreak,
//     enforce: 'pre'
//   } // 分割线
//   // code: parseCode // 代码块
//   // list: parseList // 列表
//   // listItem: parseItem, // 列表项
//   // html: parseHtml, // html 标签
//   // table: parseTable, // 表格
//   // thead: parseThead, // 表格头部
//   // tbody: parseTbody, // 表格主体
//   // tr: parseTr, // 表格行
//   // th: parseTh, // 表格头部列单元格
//   // td: parseTd, // 表格主体列单元格
// }
