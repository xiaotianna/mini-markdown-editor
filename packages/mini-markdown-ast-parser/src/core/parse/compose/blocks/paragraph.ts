import type { Tokens } from '@/types/tokens'
import type { ParseFnParams } from '..'
import { parseInlineElements } from '../inline'

// 转换 普通文本段落
export const parseParagraph = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: ParseFnParams) => {
  const children = parseInlineElements(trimmedLine, index, currentOffset)
  if (children.length > 0) {
    root.children.push({
      type: 'paragraph',
      children: children as Tokens[],
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: trimmedLine.length + 1,
          offset: currentOffset + trimmedLine.length
        }
      }
    })
    return true
  }
}
