import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 italic
export const parseItalic = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  // 先检查加粗，如果匹配成功则不进行斜体匹配
  const blodRegex = /^\*\*(.*?)\*\*$/
  const blodMatch = trimmedLine.match(blodRegex)
  const italicRegex = /^\*(.*?)\*$/
  const italicMatch = trimmedLine.match(italicRegex)
  if (italicMatch && !blodMatch) {
    const text = italicMatch[1]
    const italicNode = {
      type: 'italic',
      children: [
        {
          type: 'text',
          value: text,
          position: {
            start: {
              line: index + 1,
              column: 2,
              offset: currentOffset + 1
            },
            end: {
              line: index + 1,
              column: 2 + text.length,
              offset: currentOffset + 1 + text.length
            }
          }
        }
      ],
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: 2 + text.length + 1,
          offset: currentOffset + 1 + text.length + 1
        }
      }
    }
    root.children.push({
      type: 'paragraph',
      children: [italicNode as Tokens],
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: 2 + text.length + 1,
          offset: currentOffset + 1 + text.length + 1
        }
      }
    })
  }
}
