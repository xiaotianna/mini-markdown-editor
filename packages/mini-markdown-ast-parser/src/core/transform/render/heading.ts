import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'
import { prefix } from '@/common/constant'

export const renderHeading = (node: Tokens) => {
  return `<h${node.depth} class="${prefix}-h${node.depth}">${node.children?.map(astToHtml).join('')}</h${
    node.depth
  }>`
}
