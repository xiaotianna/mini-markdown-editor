import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 delete
export const parseDelete = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  const deleteRegex = /^~~(.*?)~~$/
  const deleteMatch = trimmedLine.match(deleteRegex)
  if (deleteMatch) {
    const text = deleteMatch[1]
    const deleteNode = {
      type: 'delete',
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
      children: [deleteNode as Tokens],
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
