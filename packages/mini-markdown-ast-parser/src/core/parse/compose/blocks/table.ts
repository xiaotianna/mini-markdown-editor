import type { Tokens } from '@/types/tokens'
import type { ParseFnParams } from '..'
import { parseInlineElements } from '../inline'

// 转换 table
export const parseTable = ({
  trimmedLine,
  index,
  currentOffset,
  root,
  currentStatus
}: ParseFnParams) => {
  // 表格
  const tableRegex = /^\|.*\|$/
  const tableSeparatorRegex = /^\|.*?---.*?\|$/
  if (tableRegex.test(trimmedLine)) {
    if (tableSeparatorRegex.test(trimmedLine)) {
    } else {
      const cells = trimmedLine
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0)
      if (!currentStatus.currentTable) {
        currentStatus.currentTable = {
          type: 'table',
          children: [],
          position: {
            start: { line: index + 1, column: 1, offset: currentOffset },
            end: {
              line: index + 1,
              column: trimmedLine.length + 1,
              offset: currentOffset + trimmedLine.length
            }
          }
        }
        root.children.push(currentStatus.currentTable)
      }
      const rowNode = {
        type: 'tableRow',
        children: cells.map((cell) => {
          // 解析行内元素
          const children = parseInlineElements(cell, index, currentOffset)
          return {
            type: 'tableCell',
            children: children,
            position: {
              start: { line: index + 1, column: 1, offset: currentOffset },
              end: {
                line: index + 1,
                column: cell.length + 1,
                offset: currentOffset + cell.length
              }
            }
          }
        }),
        position: {
          start: { line: index + 1, column: 1, offset: currentOffset },
          end: {
            line: index + 1,
            column: trimmedLine.length + 1,
            offset: currentOffset + trimmedLine.length
          }
        }
      }
      currentStatus.currentTable.children?.push(rowNode as Tokens)
      currentStatus.currentTable.position.end = rowNode.position.end
    }
    return true
  } else {
    currentStatus.currentTable = null
    return false
  }
}
