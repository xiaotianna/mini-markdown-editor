export const parseInlineElements = (
  line: string,
  index: number,
  currentOffset: number
) => {
  const strongRegex = /\*\*(.*?)\*\*/
  const emphasisRegex = /_(.*?)_/
  const underlineRegex = /\-\-(.*?)\-\-/
  const deleteRegex = /~~(.*?)~~/
  const inlineCodeRegex = /`(.*?)`/
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g
  let offset = 0
  let children = []
  let lastIndex = 0

  while (offset < line.length) {
    const strongMatch = line.slice(offset).match(strongRegex)
    const emphasisMatch = line.slice(offset).match(emphasisRegex)
    const underlineMatch = line.slice(offset).match(underlineRegex)
    const deleteMatch = line.slice(offset).match(deleteRegex)
    const inlineCodeMatch = line.slice(offset).match(inlineCodeRegex)

    let match: RegExpMatchArray | null = null
    let type = ''
    let regex = null

    if (
      strongMatch &&
      (!match || (strongMatch.index ?? Infinity) < (match?.index ?? Infinity))
    ) {
      match = strongMatch
      type = 'strong'
      regex = strongRegex
    }
    if (
      emphasisMatch &&
      (!match || (emphasisMatch.index ?? Infinity) < (match?.index ?? Infinity))
    ) {
      match = emphasisMatch
      type = 'emphasis'
      regex = emphasisRegex
    }
    if (
      underlineMatch &&
      (!match ||
        (underlineMatch.index ?? Infinity) < (match?.index ?? Infinity))
    ) {
      match = underlineMatch
      type = 'underline'
      regex = underlineRegex
    }
    if (
      deleteMatch &&
      (!match || (deleteMatch.index ?? Infinity) < (match?.index ?? Infinity))
    ) {
      match = deleteMatch
      type = 'delete'
      regex = deleteRegex
    }
    if (
      inlineCodeMatch &&
      (!match ||
        (inlineCodeMatch.index ?? Infinity) < (match?.index ?? Infinity))
    ) {
      match = inlineCodeMatch
      type = 'inlineCode'
      regex = inlineCodeRegex
    }

    // 添加图片匹配逻辑
    const imageMatch = line.slice(offset).match(imageRegex)
    if (imageMatch) {
      for (let i = 0; i < imageMatch.length; i++) {
        const fullMatch = imageMatch[i]
        const [alt, url] = fullMatch
          .match(/^!\[(.*?)\]\((.*?)\)$/)
          ?.slice(1) || ['', '']
        const imageNode = {
          type: 'image',
          title: null,
          url: url,
          alt: alt,
          position: {
            start: {
              line: index + 1,
              column: offset + 1,
              offset: currentOffset + offset
            },
            end: {
              line: index + 1,
              column: offset + fullMatch.length + 1,
              offset: currentOffset + offset + fullMatch.length
            }
          }
        }
        children.push(imageNode)
        offset += fullMatch.length
        lastIndex = offset
      }
    } else {
      const linkMatch = line.slice(offset).match(linkRegex)
      if (
        linkMatch &&
        (!match || (linkMatch.index ?? Infinity) < (match?.index ?? Infinity))
      ) {
        match = linkMatch
        type = 'link'
        regex = linkRegex
      }
    }

    if (match) {
      if (match.index !== undefined && match.index > 0) {
        children.push({
          type: 'text',
          value: line.slice(offset, offset + (match.index ?? 0)),
          position: {
            start: {
              line: index + 1,
              column: offset + 1,
              offset: currentOffset + offset
            },
            end: {
              line: index + 1,
              column: offset + (match.index ?? 0) + 1,
              offset: currentOffset + offset + (match.index ?? 0)
            }
          }
        })
      }
      if (type === 'link') {
        children.push({
          type: type,
          title: null,
          url: match[2],
          children: [
            {
              type: 'text',
              value: match[1],
              position: {
                start: {
                  line: index + 1,
                  column: offset + (match.index ?? 0) + 1,
                  offset: currentOffset + offset + (match.index ?? 0)
                },
                end: {
                  line: index + 1,
                  column: offset + (match.index ?? 0) + match[1].length + 1,
                  offset:
                    currentOffset +
                    offset +
                    (match.index ?? 0) +
                    match[1].length
                }
              }
            }
          ],
          position: {
            start: {
              line: index + 1,
              column: offset + 1,
              offset: currentOffset + offset
            },
            end: {
              line: index + 1,
              column: offset + (match.index ?? 0) + match[0].length + 1,
              offset:
                currentOffset + offset + (match.index ?? 0) + match[0].length
            }
          }
        })
      } else {
        children.push({
          type: type,
          children: [
            {
              type: 'text',
              value: match[1],
              position: {
                start: {
                  line: index + 1,
                  column: offset + (match.index ?? 0) + 3,
                  offset: currentOffset + offset + (match.index ?? 0) + 2
                },
                end: {
                  line: index + 1,
                  column: offset + (match.index ?? 0) + match[0].length - 2,
                  offset:
                    currentOffset +
                    offset +
                    (match.index ?? 0) +
                    match[0].length -
                    3
                }
              }
            }
          ],
          position: {
            start: {
              line: index + 1,
              column: offset + (match.index ?? 0) + 1,
              offset: currentOffset + offset + (match.index ?? 0)
            },
            end: {
              line: index + 1,
              column: offset + (match.index ?? 0) + match[0].length + 1,
              offset:
                currentOffset + offset + (match.index ?? 0) + match[0].length
            }
          }
        })
      }
      offset += (match.index ?? 0) + match[0].length
      lastIndex = offset
    } else {
      break
    }
  }

  if (lastIndex < line.length) {
    children.push({
      type: 'text',
      value: line.slice(lastIndex),
      position: {
        start: {
          line: index + 1,
          column: lastIndex + 1,
          offset: currentOffset + lastIndex
        },
        end: {
          line: index + 1,
          column: line.length + 1,
          offset: currentOffset + line.length
        }
      }
    })
  }

  return children
}
