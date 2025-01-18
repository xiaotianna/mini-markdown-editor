import type { RootTokens } from '@/types/tokens'
import { parseMap, defaultParse } from './compose'

// 词法分析器
export const tokenizer = (lines: string[], root: RootTokens) => {
  if (!Array.isArray(lines)) {
    return new Error('The parameter is an array')
  }

  let currentOffset = 0
  let currentStatus = {
    depth: 0,
    currentBlockquote: null,
    currentList: null,
    currentListItem: null
  }

  // 遍历每一行
  lines.forEach((line, index) => {
    // 去除首尾空格
    const trimmedLine = line.trim()

    // 是否继续转换
    let isParse = false
    for (const [key, parseFn] of Object.entries(parseMap)) {
      const result = parseFn({ trimmedLine, line, currentOffset, index, root, currentStatus })
      if (result) {
        isParse = true
        break
      }
    }
    if (!isParse) {
      defaultParse({ trimmedLine, line, currentOffset, index, root, currentStatus })
    }
    currentOffset += line.length + 1
  })
}
