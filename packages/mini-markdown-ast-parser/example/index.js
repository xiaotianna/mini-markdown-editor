import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseMarkdown, transformHtml } from '../dist/bundle.js'
const __dirname = dirname(fileURLToPath(import.meta.url))

const code = fs.readFileSync(
  path.resolve(__dirname, './demo.md'),
  'utf-8'
)
const ast = parseMarkdown(code)
const html = transformHtml(ast)
const newHtml = `<link rel="stylesheet" href="./demo.css">` + html
const node_modulesCSSPath = path.resolve(__dirname, '../node_modules/highlight.js/styles/atom-one-dark.min.css')
const node_modulesCSS = fs.readFileSync(node_modulesCSSPath, 'utf-8')

const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>${node_modulesCSS}</style>
  </head>
  <body>
    ${newHtml}
  </body>
  </html>
  `

fs.writeFileSync(path.resolve(__dirname, './index.html'), indexHtml)
console.log('index.html 生成成功\npath:', path.resolve(__dirname, './index.html'));

