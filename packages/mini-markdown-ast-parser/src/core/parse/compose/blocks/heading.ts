import type { Tokens } from '@/types/tokens'
import type { ParseFnParams } from '..'
import { parseInlineElements } from '../inline'

// 转换 h1-h6
export const parseHeading = ({
  trimmedLine,
  index,
  currentOffset,
  root,
  resetCurrentStatus
}: ParseFnParams) => {
  for (let d = 1; d <= 6; d++) {
    const headingPrefix = '#'.repeat(d) + ' '
    if (trimmedLine.startsWith(headingPrefix)) {
      const text = trimmedLine.slice(headingPrefix.length)
      // 调用 parseInlineElements 解析行内元素
      const children = parseInlineElements(text, index, currentOffset)

      const headingNode = {
        type: 'heading',
        depth: d,
        children: children,
        position: {
          start: { line: index + 1, column: 1, offset: currentOffset },
          end: {
            line: index + 1,
            column: d + 2 + text.length,
            offset: currentOffset + d + 1 + text.length
          }
        }
      }
      root.children.push(headingNode as Tokens)
      resetCurrentStatus()
      return true
    }
  }
}
