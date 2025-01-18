import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 underline
export const parseUnderline = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  const underlineRegex = /^\-\-(.*?)\-\-$/
  const underlineMatch = trimmedLine.match(underlineRegex)
  if (underlineMatch) {
    const text = underlineMatch[1]
    const underlineNode = {
      type: 'underline',
      children: [
        {
          type: 'text',
          value: text,
          position: {
            start: {
              line: index + 1,
              column: 3,
              offset: currentOffset + 2
            },
            end: {
              line: index + 1,
              column: 3 + text.length,
              offset: currentOffset + 2 + text.length
            }
          }
        }
      ],
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: 3 + text.length + 2,
          offset: currentOffset + 2 + text.length + 2
        }
      }
    }
    root.children.push({
      type: 'paragraph',
      children: [underlineNode as Tokens],
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: 3 + text.length + 2,
          offset: currentOffset + 2 + text.length + 2
        }
      }
    })
  }
}
