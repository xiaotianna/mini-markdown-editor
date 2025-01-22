import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderBold = (node: Tokens) => {
  return `<strong>${node.children?.map(astToHtml).join('')}</strong>`
}
