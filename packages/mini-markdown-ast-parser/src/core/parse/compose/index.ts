import type { TokenTypeVal } from '@/types/tokens-types'
import type { RootTokens, Tokens } from '@/types/tokens'
// default
import { parseParagraph } from './blocks/paragraph'
// 块级
import { parseHeading } from './blocks/heading'
import { parseBlockquote } from './blocks/blockquote'
import { parseThematicBreak } from './blocks/thematicBreak'
import { parseCode } from './blocks/code'
import { parseList } from './blocks/list'
import { parseTable } from './blocks/table'

const parseMap: Partial<ParseMapType> = {
  // 块级
  heading: parseHeading, // 标题
  blockquote: parseBlockquote, // 引用
  thematicBreak: parseThematicBreak, // 分割线
  code: parseCode, // 代码块
  list: parseList, // 列表
  table: parseTable, // 表格
}

export const defaultParse = parseParagraph // 默认解析器（段落）

export { parseMap }

export type ParseFnParams = {
  trimmedLine: string
  line: string
  lines: string[]
  index: number
  currentOffset: number
  root: RootTokens
  currentStatus: {
    depth: number | null
    currentBlockquote: Tokens | null
    inCodeBlock: boolean
    codeBlockLang: string
    codeBlockValue: string
    codeBlockStartOffset: number
    codeBlockStartLine: number
    currentList: Tokens | null
    currentListItem: Tokens | null
    currentIndent: number
    listStack: Tokens[]
    currentTable: Tokens | null
  },
  resetCurrentStatus: () => void
}

type ParseMapType = {
  [key in TokenTypeVal]: (params: ParseFnParams) => boolean | void
}
