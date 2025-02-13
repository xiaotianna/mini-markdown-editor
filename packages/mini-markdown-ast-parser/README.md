# @mini-markdown-rc/ast-parser markdown 编辑器 ast 解析器

一个 markdown 编辑器的 ast 解析器，导出了 `parseMarkdown` 和 `transformHtml` 方法

- `parseMarkdown`：用于解析 markdown 文本，返回一个 ast 对象。
- `transformHtml`：用于将 ast 对象转换为 html 字符串。

## 安装

### 通过 npm、yarn、pnpm 安装

```bash
# npm
npm install @mini-markdown-rc/ast-parser
# yarn
yarn add @mini-markdown-rc/ast-parser
# pnpm
pnpm add @mini-markdown-rc/ast-parser
```

### 开发环境 monorepo 项目中安装

```bash
# 进入到子项目目录终端
pnpm add @mini-markdown-rc/ast-parser
```

## 使用

```js
// esm
import { parseMarkdown, transformHtml } from '@mini-markdown-rc/ast-parser'
// commonjs
const { parseMarkdown, transformHtml } = require('@mini-markdown-rc/ast-parser')
// 样式导入
import '@mini-markdown-rc/ast-parser/style'

// 解析 markdown 内容为 ast 对象
const ast = parseMarkdown(code)
// 转换 ast 为 html 字符串
const html = transformHtml(ast)
```

## 案例

```js
// 读取 markdown 文件
const code = fs.readFileSync(
  path.resolve(__dirname, './demo.md'),
  'utf-8'
)
// 解析 markdown 内容为 ast 对象
const ast = parseMarkdown(code)
// 转换 ast 为 html 字符串
const html = transformHtml(ast)
// 插入样式
const newHtml = `<link rel="stylesheet" href="./demo.css">` + html
// highlight.js 样式文件（对 代码块 着色）
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
```

## 目录结构

```bash
- mini-markdown-ast-parser
    - dist # 打包后的文件
    - examples # 案例
    - src
        - common # 公共方法
        - core # 核心代码
            - parse
            - transform
        - styles
        - types
```

## 脚本

- `pnpm dev`：开发模式
- `pnpm build`：打包
- `pnpm demo`：构建案例项目
