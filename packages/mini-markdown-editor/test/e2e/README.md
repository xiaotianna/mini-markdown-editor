# e2e 端到端测试

## 如何运行

```bash
# 运行所有端到端测试
pnpm e2e
# 运行 UI 端到端测试
pnpm e2e:ui
# 调试模式运行测试
pnpm e2e:debug
```

> 注意：测试端口为`5173`

`e2e` 和 `e2e:ui` 的区别：

e2e：
- 在命令行中运行所有 E2E 测试，输出结果到终端。
- 适合在 CI/CD 环境或自动化脚本中使用，不需要图形界面。

e2e:ui：
- 启动 Playwright 的 UI 测试运行器，提供图形化界面来管理和运行测试。

## 如何搭建Playwright测试环境？

[如何搭建Playwright测试环境](./docs/如何搭建Playwright测试环境.md)