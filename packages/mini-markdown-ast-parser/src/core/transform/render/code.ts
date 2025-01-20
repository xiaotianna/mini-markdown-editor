import { prefix } from '@/common/constant'
import { Tokens } from '@/types/tokens'
import hljs from 'highlight.js'

export const renderCode = (node: Tokens) => {
  // const escapedCodeValue = node
  //   .value!.replace(/</g, '&lt;')
  //   .replace(/>/g, '&gt;')
  const highlightedCode = hljs.highlight(node.value!, {
    language: node.lang || 'plaintext',
  }).value
  return `<div class="${prefix}-code-container">
    <div class="${prefix}-code-header">
      <div class="${prefix}-code-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="${prefix}-code-right">${node.lang}</div>
    </div>
    <pre><code class="language-${node.lang}">${highlightedCode}</code></pre>
  </div>`
}
