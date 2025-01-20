import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderBlod = (node: Tokens) => {
  return `<strong>${node.children?.map(astToHtml).join('')}</strong>`
}
