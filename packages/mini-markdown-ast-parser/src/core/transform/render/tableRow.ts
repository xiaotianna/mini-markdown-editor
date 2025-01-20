import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'
import { prefix } from '@/common/constant'

export const renderTableRow = (node: Tokens) => {
  return `<tr class="${prefix}-tr">${node.children?.map(astToHtml).join('')}</tr>`
}
