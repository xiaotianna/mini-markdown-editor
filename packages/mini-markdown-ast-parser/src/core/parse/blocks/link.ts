import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 link
export const parseLink = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  const linkRegex = /^\[(.*?)\]\((.*?)\)$/
  // 匹配链接
  const linkMatch = trimmedLine.match(linkRegex)
  if (linkMatch) {
    const text = linkMatch[1]
    const url = linkMatch[2]
    const linkNode = {
      type: 'link',
      title: null,
      url: url,
      children: [
        {
          type: 'text',
          value: text,
          position: {
            start: { line: index + 1, column: 2, offset: currentOffset + 1 },
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
          column: trimmedLine.length + 1,
          offset: currentOffset + trimmedLine.length
        }
      }
    }
    root.children.push({
      type: 'paragraph',
      children: [linkNode as Tokens],
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
