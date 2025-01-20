import type { RootTokens } from '../../types/tokens'
import { parseMap, defaultParse } from './compose'

// 词法分析器
export const tokenizer = (lines: string[], root: RootTokens) => {
  if (!Array.isArray(lines)) {
    return new Error('The parameter is an array')
  }

  let currentOffset = 0
  let currentStatus = {
    // heading 的层级
    depth: 0,
    // 当前的 blockquote
    currentBlockquote: null,
    // code
    inCodeBlock: false,
    codeBlockLang: '',
    codeBlockValue: '',
    codeBlockStartOffset: 0,
    codeBlockStartLine: 0,
    // list
    currentList: null,
    currentListItem: null,
    currentIndent: 0,
    listStack: [], // 用于存储列表栈
    // table
    currentTable: null,
  }
  const resetCurrentStatus = () => {
    currentStatus = {
      depth: 0,
      currentBlockquote: null,
      inCodeBlock: false,
      codeBlockLang: '',
      codeBlockValue: '',
      codeBlockStartOffset: 0,
      codeBlockStartLine: 0,
      currentList: null,
      currentListItem: null,
      currentIndent: 0,
      listStack: [],
      currentTable: null
    }
  }

  // 遍历每一行
  lines.forEach((line, index) => {
    // 去除首尾空格
    const trimmedLine = line.trim()

    // 是否继续转换
    let isParse = false
    for (const [key, parseFn] of Object.entries(parseMap)) {
      const result = parseFn({
        trimmedLine,
        line,
        lines,
        currentOffset,
        index,
        root,
        currentStatus,
        resetCurrentStatus
      })
      if (result) {
        isParse = true
        break
      }
    }
    if (!isParse) {
      defaultParse({
        trimmedLine,
        line,
        lines,
        currentOffset,
        index,
        root,
        currentStatus,
        resetCurrentStatus
      })
    }
    currentOffset += line.length + 1
  })
}
