import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 blockquote
export const parseBlockquote = ({
  trimmedLine,
  index,
  currentOffset,
  root,
  currentStatus
}: BlockFnParams) => {
  // 引用内容
  if (trimmedLine.startsWith('>')) {
    const text = trimmedLine.slice(1).trim()
    const textNode = {
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
    const paragraphNode = {
      type: 'paragraph',
      children: [textNode],
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

    if (!currentStatus.currentBlockquote) {
      currentStatus.currentBlockquote = {
        type: 'blockquote',
        children: [],
        position: {
          start: {
            line: index + 1,
            column: 1,
            offset: currentOffset
          },
          end: {
            line: index + 1,
            column: 3 + text.length,
            offset: currentOffset + 2 + text.length
          }
        }
      }
      root.children.push(currentStatus.currentBlockquote)
    }

    currentStatus.currentBlockquote.children?.push(paragraphNode as Tokens)
    currentStatus.currentBlockquote.position.end = paragraphNode.position.end
  } else {
    currentStatus.currentBlockquote = null
  }
}
