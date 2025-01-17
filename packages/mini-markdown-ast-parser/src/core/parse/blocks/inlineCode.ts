import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 inlineCode
export const parseInlineCode = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  // 解析内联代码
  const inlineCodeRegex = /(`+)(.*?)\1/g
  let match
  let lastIndex = 0
  let paragraphChildren = []

  while ((match = inlineCodeRegex.exec(trimmedLine)) !== null) {
    const beforeText = trimmedLine.slice(lastIndex, match.index)
    if (beforeText) {
      paragraphChildren.push({
        type: 'text',
        value: beforeText,
        position: {
          start: {
            line: index + 1,
            column: lastIndex + 1,
            offset: currentOffset + lastIndex
          },
          end: {
            line: index + 1,
            column: match.index + 1,
            offset: currentOffset + match.index
          }
        }
      })
    }

    paragraphChildren.push({
      type: 'inlineCode',
      value: match[2],
      position: {
        start: {
          line: index + 1,
          column: match.index + 1,
          offset: currentOffset + match.index
        },
        end: {
          line: index + 1,
          column: match.index + 1 + match[0].length,
          offset: currentOffset + match.index + match[0].length
        }
      }
    })

    lastIndex = inlineCodeRegex.lastIndex
  }

  if (lastIndex < trimmedLine.length) {
    paragraphChildren.push({
      type: 'text',
      value: trimmedLine.slice(lastIndex),
      position: {
        start: {
          line: index + 1,
          column: lastIndex + 1,
          offset: currentOffset + lastIndex
        },
        end: {
          line: index + 1,
          column: trimmedLine.length + 1,
          offset: currentOffset + trimmedLine.length
        }
      }
    })
  }

  if (paragraphChildren.length > 0) {
    root.children.push({
      type: 'paragraph',
      children: paragraphChildren as Tokens[],
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: trimmedLine.length + 1,
          offset: currentOffset + trimmedLine.length
        }
      }
    })
  }
}
