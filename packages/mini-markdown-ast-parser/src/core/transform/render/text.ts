import { Tokens } from '@/types/tokens'

export const renderText = (node: Tokens) => {
  return node.value!.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
