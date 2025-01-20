import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'
import { prefix } from '@/common/constant'

export const renderTableCell = (node: Tokens) => {
  return `<td class="${prefix}-td">${node.children?.map(astToHtml).join('')}</td>`
}
