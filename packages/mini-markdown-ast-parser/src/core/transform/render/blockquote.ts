import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'
import { prefix } from '@/common/constant'

export const renderBlockquote = (node: Tokens) => {
  return `<blockquote class="${prefix}-blockquote">${node.children
    ?.map(astToHtml)
    .join('')}</blockquote>`
}
