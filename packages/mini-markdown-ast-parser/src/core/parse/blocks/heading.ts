import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 h1-h6
export const parseHeading = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  for (let d = 1; d <= 6; d++) {
    const headingPrefix = '#'.repeat(d) + ' '
    if (trimmedLine.startsWith(headingPrefix)) {
      const text = trimmedLine.slice(headingPrefix.length)
      // 创建 heading 节点
      const headingNode = {
        type: 'heading',
        depth: d,
        children: [
          {
            type: 'text',
            value: text,
            position: {
              start: {
                line: index + 1,
                column: d + 2,
                offset: currentOffset + d + 1
              },
              end: {
                line: index + 1,
                column: d + 2 + text.length,
                offset: currentOffset + d + 1 + text.length
              }
            }
          }
        ],
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
      break
    }
  }
}
