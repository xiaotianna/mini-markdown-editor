import { parseMarkdown } from '@/core/parse'
import fs from 'node:fs'
import path from 'node:path'

const fromMarkdown = (code: string) => {
  const tokens = parseMarkdown(code)
  return tokens
}

// const code = fs.readFileSync(path.resolve(process.cwd(), 'markdown/demo.md'), 'utf-8')
// const ast = fromMarkdown(code)

function astToHtml(node: any):any {
  switch (node.type) {
    case 'root':
      return node.children.map(astToHtml).join('')
    case 'heading':
      return `<h${node.depth}>${node.children.map(astToHtml).join('')}</h${node.depth}>`
    case 'text':
      return node.value
    case 'paragraph':
      return `<p>${node.children.map(astToHtml).join('')}</p>`
    case 'strong':
      return `<strong>${node.children.map(astToHtml).join('')}</strong>`
    case 'emphasis':
      return `<em>${node.children.map(astToHtml).join('')}</em>`
    case 'underline':
      return `<u>${node.children.map(astToHtml).join('')}</u>`
    case 'delete':
      return `<del>${node.children.map(astToHtml).join('')}</del>`
    case 'thematicBreak':
      return `<hr>`
    case 'inlineCode':
      // 修改: 直接使用 node.children[0].value 来生成 HTML
      return `<code style="background: #f1f1f1; padding: 2px 4px; border-radius: 4px;">${node.children[0].value}</code>`
    case 'link':
      return `<a href="${node.url}">${astToHtml(node.children[0])}</a>`
    case 'blockquote':
      return `<blockquote style="border: 1px solid red;">${node.children.map(astToHtml).join('')}</blockquote>`
    case 'image':
      return `<img src="${node.url}" alt="${node.alt}" title="${
        node.title || ''
      }">`
    default:
      return ''
  }
}

const code = fs.readFileSync(process.cwd() + '/markdown/demo.md', 'utf8')
// console.log(code);

const ast = parseMarkdown(code)
console.log(JSON.stringify(ast))

// Convert AST to HTML
const html =
  astToHtml(ast) +
  `<style>
        table {
            width: 50%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
    </style>`
// console.log(html);

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  ${html}
</body>
<script>
console.log(${JSON.stringify(ast)})
</script>
</html>
`

fs.writeFileSync('./index.html', indexHtml)