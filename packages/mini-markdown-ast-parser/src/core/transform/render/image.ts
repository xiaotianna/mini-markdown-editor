import { prefix } from '@/common/constant'
import { Tokens } from '@/types/tokens'

export const renderImage = (node: Tokens) => {
  return `<img class="${prefix}-image" src="${node.url}" alt="${node.alt}" title="${node.title || ''}">`
}
