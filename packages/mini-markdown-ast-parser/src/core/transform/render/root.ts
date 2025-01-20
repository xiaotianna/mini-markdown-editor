import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'

export const renderRoot = (node: Tokens) => {
  return node.children!.map(astToHtml).join('')
}
