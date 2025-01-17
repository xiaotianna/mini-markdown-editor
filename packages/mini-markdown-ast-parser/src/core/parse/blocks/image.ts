import type { Tokens } from "@/types/tokens"
import type { BlockFnParams } from "."

// 转换 image
export const parseImage = ({
  trimmedLine,
  index,
  currentOffset,
  root
}: BlockFnParams) => {
  const imageRegex = /^!\[(.*?)\]\((.*?)\)$/
  const imageMatch = trimmedLine.match(imageRegex)
  if (imageMatch) {
    const alt = imageMatch[1]
    const url = imageMatch[2]
    const imageNode = {
      type: 'image',
      title: null,
      url: url,
      alt: alt,
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
      children: [imageNode as Tokens],
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
