import { tokenizer } from './tokenizer'
import type { RootTokens } from '../../types/tokens'

// 语法分析
export const parseMarkdown = (markdown: string): RootTokens => {
  const lines = markdown.split('\n')
  // 根节点
  const root: RootTokens = {
    type: 'root',
    children: [],
    position: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: lines.length, column: 1, offset: markdown.length }
    }
  }
  // 语法解析（词法分析器）
  tokenizer(lines, root)
  return root
}
