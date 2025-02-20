import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  name: "editor-e2e-test",
  testDir: "./test/e2e",
  fullyParallel: true, // 运行所有测试文件，而不仅仅是当前文件
  /**
   * .only 表示只有 "test case 2" 才会运行，其他用例不会运行
   *    test.only('test case 2', async ({ page }) => {
            await page.goto('http://example.com');
            await expect(page).toHaveTitle('Example Domain');
        });
   */
  forbidOnly: !!process.env.CI, // 禁止使用 .only 标记，确保所有测试都能被完整执行
  retries: process.env.CI ? 2 : 0, // 在 CI 环境下重试失败的测试用例两次
  workers: process.env.CI ? 1 : undefined, // 在 CI 环境下使用 1 个 worker，避免资源冲突
  reporter: "html", // 生成 HTML 报告
  use: {
    // 浏览器配置
    baseURL: "http://localhost:5173",
    headless: true, // 在 CI 环境下使用无头浏览器，提高性能
    trace: "on-first-retry", // 在 CI 环境下生成 trace 文件，用于调试
  },
  projects: [
    // 配置多个浏览器环境
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }, // devices 一个预定义的设备配置集合，包含了各种常见浏览器和设备的配置
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
  webServer: {
    // 启动一个本地服务器，用于提供测试数据
    command: "pnpm dev", // 启动命令
    port: 5173,
    reuseExistingServer: !process.env.CI, // 避免在CI中重复启动服务器
  },
});
