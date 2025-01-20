import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderUnderline = (node: Tokens) => {
  return `<u>${node.children?.map(astToHtml).join('')}</u>`
}
