import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderParagraph = (node: Tokens) => {
  return `<p>${node.children?.map(astToHtml).join('')}</p>`
}
