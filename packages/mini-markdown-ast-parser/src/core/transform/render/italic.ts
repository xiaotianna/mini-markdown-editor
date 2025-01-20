import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderItalic = (node: Tokens) => {
  return `<em>${node.children?.map(astToHtml).join('')}</em>`
}
