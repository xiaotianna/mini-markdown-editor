import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderDelete = (node: Tokens) => {
  return `<del>${node.children?.map(astToHtml).join('')}</del>`
}
