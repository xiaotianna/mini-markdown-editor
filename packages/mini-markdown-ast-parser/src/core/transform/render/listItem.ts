import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'
import { prefix } from '@/common/constant'

export const renderListItem = (node: Tokens) => {
  return `<li class="${prefix}-li">${node.children?.map(astToHtml).join('')}</li>`
}
