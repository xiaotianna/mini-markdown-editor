项目采用 `monorepo` 架构，项目包含3个子项目

- `mini-markdown-ast-parser`：Markdown AST 解析器
- `mini-markdown-editor`：Markdown 编辑器
- `mini-markdown-material`：物料组件库

```bash [安装]
# markdown解析器
pnpm add mini-markdown-ast-parser
# react markdown 编辑器
pnpm add mini-markdown-editor
```



::: code-group

```bash [安装]
# markdown解析器
pnpm add mini-markdown-ast-parser
# react markdown 编辑器
pnpm add mini-markdown-editor
```

```js [markdown解析器]
// esm
import { parseMarkdown, transformHtml } from '@mini-markdown/ast-parser'
// commonjs
const { parseMarkdown, transformHtml } = require('@mini-markdown/ast-parser')
// 样式导入
import '@mini-markdown/ast-parser/style'

// 解析 markdown 内容为 ast 对象
const ast = parseMarkdown(code)
// 转换 ast 为 html 字符串
const html = transformHtml(ast)
```

```tsx [markdown编辑器]
import { useState } from 'react'
import { Editor, Preview } from 'mini-markdown-editor'
import 'mini-markdown-editor/dist/style.css'

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Hello Mini Markdown\n\n这是一个简单的示例')

  return (
    <div className="flex min-h-screen">
      {/* 编辑器区域 */}
      <div className="w-1/2 p-4 border-r">
        <Editor
          value={markdown}
          onChange={setMarkdown}
          className="h-full"
          placeholder="请输入 Markdown 内容..."
        />
      </div>

      {/* 预览区域 */}
      <div className="w-1/2 p-4">
        <Preview 
          value={markdown}
          className="prose max-w-none"
        />
      </div>
    </div>
  )
}
```

:::

<style>
:root {
  --vp-home-hero-image-background-image: linear-gradient(-135deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>