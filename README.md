# mini-markdown-editor 迷你 markdown 编辑器

采用 pnpm + monorepo 进行管理

## 目录结构

```
- docs 文档
- packages
    - mini-markdown-ast-parser markdown 编辑器 ast 解析器（采用 ts 开发）
    - mini-markdown-editor 编辑器（采用 next.js 开发）
    - mini-markdown-material 编辑器物料组件库（react + vite 开发、打包）
    - mini-markdown-play 物料组件库测试项目
- scripts 脚本
```

## 命令

> 请使用 pnpm@7 进行依赖安装

```bash
# 安装依赖
pnpm in
```

## git提交规范

1. 需要全局安装 `commitizen`

```bash
pnpm add -g commitizen
```

2. 切换到自己的分支

```bash
git checkout dev_xxx
```

3. 添加文件到暂存区

```bash
git add .
```

4. 将暂存区的文件提交到本地仓库

> 用 `git cz` 命令代替 `git commit`，eslint 校验通过后，才能进行后续操作

```bash
git cz
```

5. 推送到远程仓库

```bash
git push origin dev_xxx
```

6、测试git