import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderList = (node: Tokens) => {
  const listType = node.ordered ? 'ol' : 'ul'
  return `<${listType}>${node.children?.map(astToHtml).join('')}</${listType}>`
}
