import { prefix } from '@/common/constant'
import { Tokens } from '@/types/tokens'

export const renderInlineCode = (node: Tokens) => {
  // 转义HTML标签
  const escapedValue = node
    .children![0].value!.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<code class="${prefix}-inline-code">${escapedValue}</code>`
}
