import { test, expect } from "@playwright/test";

test.describe("Markdown Editor E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("基础编辑功能测试", async ({ page }) => {
    // 测试编辑器是否正确加载
    await expect(page.locator(".markdown-editor-content")).toBeVisible();

    // 测试输入文本
    const editor = page.locator(".markdown-editor-content");
    await editor.click();
    await page.keyboard.type("# Hello World");

    // 验证预览区域是否正确渲染
    await expect(page.locator(".markdown-editor-preview h1")).toContainText("Hello World");
  });

  // test('工具栏功能测试', async ({ page }) => {
  //   const editor = page.locator('.markdown-editor-content');
  //   await editor.click();

  //   // 测试加粗功能
  //   await page.getByRole('button', { name: '加粗' }).click();
  //   await page.keyboard.type('Bold Text');
  //   await expect(editor).toContainText('**Bold Text**');
  // });

  // test('主题切换测试', async ({ page }) => {
  //   // 切换到暗色主题
  //   await page.getByRole('button', { name: '主题切换light' }).click();
  //   await expect(page.locator('body')).toHaveClass(/dark/);
  // });

  // test('文件导出测试', async ({ page }) => {
  //   // 输入一些内容
  //   const editor = page.locator('.markdown-editor-content');
  //   await editor.click();
  //   await page.keyboard.type('# Test Export');

  //   // 点击导出按钮
  //   await page.getByRole('button', { name: '导出' }).click();

  //   // 验证导出对话框是否出现
  //   await expect(page.getByText('导出文件类型')).toBeVisible();
  // });
});
