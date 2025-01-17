import { parseMarkdown } from '@/core/parse'
import fs from 'node:fs'
import path from 'node:path'

const fromMarkdown = (code: string) => {
  const tokens = parseMarkdown(code)
  return tokens
}

const code = fs.readFileSync(path.resolve(process.cwd(), 'markdown/demo.md'), 'utf-8')
const tokens = fromMarkdown(code)

console.log(JSON.stringify(tokens));

