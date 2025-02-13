# mini-markdown-editor 迷你 markdown 编辑器

采用 pnpm + monorepo 进行管理

## 目录结构

```
- docs 文档
- packages
    - mini-markdown-ast-parser markdown 编辑器 ast 解析器（采用 rollup + ts 开发）
    - mini-markdown-editor 编辑器（采用 react + vite 开发、打包）
    - mini-markdown-play 测试项目
- scripts 脚本
```

## 命令

> 请使用 pnpm@7 进行依赖安装

```bash
# 安装依赖
pnpm in
# 清空项目 node_modules 和 dist 目录
pnpm clear
# 运行 mini-markdown-ast-parser
pnpm dev:ast
# 构建 mini-markdown-ast-parser
pnpm build:ast
# 构建 mini-markdown-ast-parser 案例项目
pnpm build:ast:play
# 运行 mini-markdown-editor
pnpm dev:editor
# 构建 mini-markdown-editor
pnpm build:editor
# 测试 mini-markdown-editor
pnpm test:editor
# 测试 mini-markdown-editor（watch）
pnpm test:editor:watch
# 测试 mini-markdown-editor（coverage）
pnpm test:coverage
# 运行mini-markdown-docs
pnpm dev:docs
# 构建 mini-markdown-docs
pnpm build:docs

# 发布 npm
pnpm changeset
pnpm changeset version
pnpm changeset publish
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

## 版本更新

使用 `changeset` 进行版本更新

### 1. 安装

```bash
pnpm add @changesets/cli -D -w
```

### 2. 初始化

```bash
pnpm changeset init
```

### 3. 预发布

```bash
pnpm changeset pre enter 「tag」
# alpha 内部测试版
# beta 测试版
# rc 候选版本
```

> 退出预发布 `pnpm changeset pre exit`

### 4. 正式发布

步骤1:

```bash
pnpm changeset
```

```bash
# 更新的子包有哪些
🦋  Which packages would you like to include?
# 更新主版本号的包
🦋  Which packages should have a major bump?
# 更新次版本号的包
🦋  Which packages should have a minor bump?
# 更新补丁版本的包
🦋  The following packages will be patch bumped:
```

当上述命令运行完成后，会在 `.changeset/xxx.md` 文件中生成更新日志，然后提交到git仓库中。

步骤2: 消耗版本，变更子包版本

```bash
# 更新版本号，并删除 .changeset/xxx.md 文件
pnpm changeset version
```

步骤3: 发布到npm

```bash
pnpm changeset publish
```
