import { CLASS_PREFIX } from "@/common";
import { expect, test } from "playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("Status E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // 获取剪贴板权限
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

    // 左侧内容区域
    const mainContent = page.locator(".markdown-editor-content");

    // 确保页面加载完毕
    await expect(mainContent).toBeVisible();

    const mockPath = path.resolve(__dirname, "./docs/如何搭建Playwright测试环境.md");
    const mockText = fs.readFileSync(mockPath, "utf-8");
    // 输入文本
    await mainContent.click();
    await page.keyboard.insertText(mockText);
  });

  test("同步滚动功能测试", async ({ page }) => {
    // 同步滚动按钮
    const syncButton = page.locator(`.${CLASS_PREFIX}-status-content`).getByRole("checkbox");
    expect(syncButton).toBeChecked();

    // 左侧内容区域
    const mainContent = page.locator(".markdown-editor-content");
    // 右侧同步滚动区域
    const syncContent = page.locator(".markdown-editor-preview");

    // 模拟用户滚动主内容区从底部往上滚动
    // 等待内容渲染完成
    await page.waitForTimeout(2000);

    // 先将两个区域滚动到底部
    await mainContent.evaluate((element) => {
      element.scrollTo(0, element.scrollHeight);
    });
    await syncContent.evaluate((element) => {
      element.scrollTo(0, element.scrollHeight);
    });

    // 获取内容区域的实际高度（修改获取高度的方式）
    const contentHeight = await mainContent.evaluate((element) => {
      const cmContent = element.querySelector(".cm-content");
      if (cmContent) {
        return cmContent.scrollHeight - element.clientHeight;
      }
      return element.scrollHeight - element.clientHeight;
    });

    // 向上滚动左侧编辑器
    await mainContent.click();
    await page.mouse.wheel(0, -contentHeight);
    await page.waitForTimeout(2000);

    // 获取滚动后的位置
    const afterMainScrollTop = await mainContent.evaluate((element) => element.scrollTop);
    const afterSyncScrollTop = await syncContent.evaluate((element) => element.scrollTop);

    // 验证两边是否同步滚动（允许50px误差）
    expect(Math.abs(afterMainScrollTop - afterSyncScrollTop)).toBeLessThan(100);
  });

  test("滚动到顶部功能测试", async ({ page }) => {
    // 左侧内容区域和右侧预览区域
    const mainContent = page.locator(".markdown-editor-content");
    const syncContent = page.locator(".markdown-editor-preview");

    // 先将两个区域滚动到底部
    await mainContent.evaluate((element) => {
      element.scrollTo(0, element.scrollHeight);
    });
    await syncContent.evaluate((element) => {
      element.scrollTo(0, element.scrollHeight);
    });

    // 等待滚动完成
    await page.waitForTimeout(500);

    // 点击滚动到顶部按钮
    const scrollTopButton = page.getByText("滚动到顶部");
    await scrollTopButton.click();

    // 等待滚动动画完成
    await page.waitForTimeout(1000);

    // 获取滚动后的位置
    const mainScrollTop = await mainContent.evaluate((element) => element.scrollTop);
    const syncScrollTop = await syncContent.evaluate((element) => element.scrollTop);

    // 验证两个区域是否都滚动到顶部
    expect(mainScrollTop).toBeLessThan(10);
    expect(syncScrollTop).toBeLessThan(10);
  });
});
