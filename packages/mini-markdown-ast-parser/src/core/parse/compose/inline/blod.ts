import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 blod
export const parseBlod = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  const blodRegex = /^\*\*(.*?)\*\*$/
  const blodMatch = trimmedLine.match(blodRegex)
  if (blodMatch) {
    const text = blodMatch[1]
    const blodNode = {
      type: 'blod',
      children: [
        {
          type: 'text',
          value: text,
          position: {
            start: { line: index + 1, column: 3, offset: currentOffset + 2 },
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
      children: [blodNode as Tokens],
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
