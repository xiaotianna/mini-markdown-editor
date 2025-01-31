# 快速开始

## 在线尝试

可以直接在 [示例](../example) 上进行在线尝试。

## 安装

::: code-group

```sh [npm]
npm install -D mini-markdown-editor
```

```sh [yarn]
yarn add -D mini-markdown-editor
```

```sh [pnpm]
pnpm add -D mini-markdown-editor
```

:::

## 使用

```tsx [src/App.tsx]
import { Editor, Preview } from "mini-markdown-editor";

export default function App() {
  return <Editor />;
}

// 仅预览
function PreviewPage() {
  const [markdown, setMarkdown] = useState("# Hello Mini Markdown\n\n这是一个简单的示例");
  return <Preview value={markdown} />;
}
```
