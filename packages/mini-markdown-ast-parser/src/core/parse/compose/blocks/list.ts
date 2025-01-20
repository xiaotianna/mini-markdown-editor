import type { Tokens } from '@/types/tokens'
import type { ParseFnParams } from '..'
import { parseInlineElements } from '../inline'
import { TokenTypeVal } from '@/types/tokens-types'

// 转换 list
export const parseList = ({
  line,
  lines,
  index,
  currentStatus,
  root
}: ParseFnParams) => {
  // 列表项处理
  const trimmedLine = line.trimStart()
  const indent = line.length - trimmedLine.length
  const match = trimmedLine.match(/^(-|\d+\.)\s+(.*)/)
  if (match) {
    const [_, marker, content] = match
    const ordered = marker.includes('.')
    const startOffset = calculateOffset(index + 1, indent + 1, lines)
    const contentStartOffset = calculateOffset(
      index + 1,
      indent + marker.length + 1,
      lines
    )
    const contentEndOffset = contentStartOffset + content.length

    // 解析行内元素
    const children = parseInlineElements(content, index, contentStartOffset)

    const listItem = {
      type: 'listItem',
      spread: false,
      checked: null,
      children: [
        {
          type: 'paragraph',
          children: children,
          position: {
            start: {
              line: index + 1,
              column: indent + marker.length + 1,
              offset: contentStartOffset
            },
            end: {
              line: index + 1,
              column: indent + marker.length + 1 + content.length,
              offset: contentEndOffset
            }
          }
        }
      ],
      position: {
        start: {
          line: index + 1,
          column: indent + 1,
          offset: startOffset
        },
        end: {
          line: index + 1,
          column: indent + marker.length + 1 + content.length,
          offset: contentEndOffset
        }
      }
    }

    if (indent > currentStatus.currentIndent) {
      if (currentStatus.currentListItem) {
        if (
          !currentStatus.currentListItem.children?.some(
            (child) => child.type === 'list'
          )
        ) {
          const newList = {
            type: 'list',
            ordered,
            start: null,
            spread: false,
            children: [],
            position: listItem.position
          }
          currentStatus.currentListItem.children?.push(newList as Tokens)
          currentStatus.listStack.push(currentStatus.currentList as Tokens)
          currentStatus.currentList = newList as Tokens
        }
        currentStatus.currentList?.children?.push(listItem as Tokens)
      }
    } else if (indent < currentStatus.currentIndent) {
      while (
        currentStatus.listStack.length > 0 &&
        currentStatus.listStack[currentStatus.listStack.length - 1].position
          .start.column >= indent
      ) {
        currentStatus.currentList = currentStatus.listStack.pop() as Tokens
      }
      if (currentStatus.currentList) {
        currentStatus.currentList.children?.push(listItem as Tokens)
      } else {
        root.children.push({
          type: 'list' as TokenTypeVal,
          ordered,
          start: null,
          spread: false,
          children: [listItem],
          position: listItem.position
        } as Tokens)
        currentStatus.currentList = root.children[root.children.length - 1]
      }
    } else {
      // 如果当前列表类型与新列表项类型不同，则创建新的列表节点
      if (
        currentStatus.currentList &&
        currentStatus.currentList.ordered !== ordered
      ) {
        currentStatus.currentList = null
      }
      if (!currentStatus.currentList) {
        root.children.push({
          type: 'list',
          ordered,
          start: null,
          spread: false,
          children: [listItem as Tokens],
          position: listItem.position
        } as Tokens)
        currentStatus.currentList = root.children[root.children.length - 1]
      } else {
        currentStatus.currentList.children?.push(listItem as Tokens)
      }
    }

    currentStatus.currentListItem = listItem as Tokens
    currentStatus.currentIndent = indent
    return true
  }
}

// 辅助函数：计算偏移量
const calculateOffset = (index: number, column: number, lines: string[]) => {
  let offset = 0
  for (let i = 0; i < index - 1; i++) {
    offset += lines[i].length + 1 // +1 是因为换行符
  }
  return offset + column - 1
}
