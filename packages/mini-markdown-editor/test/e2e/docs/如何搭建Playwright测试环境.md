# e2e 端到端测试

## 步骤

### 一、创建项目

> 核心包：`playwright` 和 `@playwright/test`

```bash
# 会下载浏览器内核
npm init playwright
```

### 二、手动创建

1. 安装依赖

```bash
pnpm add -D playwright @playwright/test
```

2. 初始化 `Playwright` 配置

```bash
# 会下载浏览器内核
npx playwright install
```

3. 创建 Playwright 配置文件(`playwright.config.ts`)

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 三、运行测试

```bash
npx playwright test
npx playwright test --ui
npx playwright test --debug
```

### 四、VSCode 中运行测试

安装插件：`Playwright Test for VSCode`
