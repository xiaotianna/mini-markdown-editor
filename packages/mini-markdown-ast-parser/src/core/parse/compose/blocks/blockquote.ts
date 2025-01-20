import type { Tokens } from '@/types/tokens'
import type { ParseFnParams } from '..'
import { parseMarkdown } from '../..'

// 转换 blockquote
export const parseBlockquote = ({
  trimmedLine,
  line,
  index,
  currentOffset,
  root,
  currentStatus
}: ParseFnParams) => {
  // 引用内容
  if (trimmedLine.startsWith('>')) {
    const text = trimmedLine.slice(1).trim()
    if (!currentStatus.currentBlockquote) {
      currentStatus.currentBlockquote = {
        type: 'blockquote',
        children: [],
        position: {
          start: { line: index + 1, column: 1, offset: currentOffset },
          end: {
            line: index + 1,
            column: 3 + text.length,
            offset: currentOffset + 2 + text.length
          }
        }
      }
      root.children.push(currentStatus.currentBlockquote as Tokens)
    }
    // 递归解析 blockquote 内容
    const blockquoteContent = parseMarkdown(text)
    ;(currentStatus.currentBlockquote.children as Tokens[]).push(
      ...blockquoteContent.children
    )
    currentStatus.currentBlockquote.position.end = {
      line: index + 1,
      column: 3 + text.length,
      offset: currentOffset + 2 + text.length
    }
    return true
  } else if (currentStatus.currentBlockquote) {
    // 检查是否继续嵌套的 blockquote
    const nestedBlockquoteMatch = line.match(/^(\s*>)\s*(.*)/)
    if (nestedBlockquoteMatch) {
      const nestedText = nestedBlockquoteMatch[2].trim()
      const nestedTextNode = {
        type: 'text',
        value: nestedText,
        position: {
          start: {
            line: index + 1,
            column: nestedBlockquoteMatch[1].length + 3,
            offset: currentOffset + nestedBlockquoteMatch[1].length + 2
          },
          end: {
            line: index + 1,
            column: nestedBlockquoteMatch[1].length + 3 + nestedText.length,
            offset:
              currentOffset +
              nestedBlockquoteMatch[1].length +
              2 +
              nestedText.length
          }
        }
      }
      ;(currentStatus.currentBlockquote.children as Tokens[]).push({
        type: 'paragraph',
        children: [nestedTextNode as Tokens],
        position: {
          start: {
            line: index + 1,
            column: nestedBlockquoteMatch[1].length + 3,
            offset: currentOffset + nestedBlockquoteMatch[1].length + 2
          },
          end: {
            line: index + 1,
            column: nestedBlockquoteMatch[1].length + 3 + nestedText.length,
            offset:
              currentOffset +
              nestedBlockquoteMatch[1].length +
              2 +
              nestedText.length
          }
        }
      })
      currentStatus.currentBlockquote.position.end = {
        line: index + 1,
        column: nestedBlockquoteMatch[1].length + 3 + nestedText.length,
        offset:
          currentOffset +
          nestedBlockquoteMatch[1].length +
          2 +
          nestedText.length
      }
    } else {
      currentStatus.currentBlockquote = null
    }
    return true
  } else {
    currentStatus.currentBlockquote = null
    return false
  }
}
