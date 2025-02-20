# mini-markdown-editor

## 安装

```bash
pnpm install @mini-markdown-rc/editor
```

## 使用

```tsx
import { Editor } from "@mini-markdown-rc/editor";

export default function App() {
  return <Editor />;
}
```

## API

具体API参考 [https://github.com/xiaotianna/mini-markdown-editor/blob/master/docs/guide/api.mdx](https://github.com/xiaotianna/mini-markdown-editor/blob/master/docs/guide/api.mdx)

## 开发脚本

```bash
## 开发环境运行
pnpm dev

## 打包
pnpm build

## 单元测试
pnpm test

## 单元测试（watch）
pnpm test:watch

## 测试覆盖率
pnpm coverage

# e2e 测试
pnpm e2e
pnpm e2e:ui
pnpm e2e:debug
```
