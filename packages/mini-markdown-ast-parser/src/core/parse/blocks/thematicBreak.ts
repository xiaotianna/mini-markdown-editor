import type { Tokens } from '@/types/tokens'
import type { BlockFnParams } from '.'

// 转换 thematicBreak
export const parseThematicBreak = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  if (/^(?:-{3,}|[*]{3,})$/.test(trimmedLine)) {
    const thematicBreakNode = {
      type: 'thematicBreak',
      position: {
        start: { line: index + 1, column: 1, offset: currentOffset },
        end: {
          line: index + 1,
          column: trimmedLine.length + 1,
          offset: currentOffset + trimmedLine.length
        }
      }
    }
    root.children.push(thematicBreakNode as Tokens)
    return true
  } else {
    return false
  }
}
