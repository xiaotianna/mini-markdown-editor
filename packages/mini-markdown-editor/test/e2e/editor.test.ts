import { CLASS_PREFIX } from "@/common";
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
    // keyboard.type 模拟键盘输入
    await page.keyboard.type("# Hello World");

    // 验证预览区域是否正确渲染
    await expect(page.locator(".markdown-editor-preview h1")).toContainText("Hello World");
  });

  test("主题切换测试", async ({ page }) => {
    // 切换到暗色主题
    const editor = page.locator(".md-editor");
    const theme = await editor.getAttribute("data-theme");
    if (theme === "light") {
      await page.getByRole("button", { name: "主题切换light" }).click();
      await expect(editor).toHaveAttribute("data-theme", "dark");
    } else {
      await page.getByRole("button", { name: "主题切换dark" }).click();
      await expect(editor).toHaveAttribute("data-theme", "light");
    }
  });

  test("快捷键测试", async ({ page }) => {
    await page.locator(".markdown-editor-content").click();
    await page.keyboard.press(process.platform === "darwin" ? "Meta+B" : "Control+B");
    await page.keyboard.type("Bold Text");
    await expect(page.locator(".markdown-editor-preview strong")).toContainText("Bold Text");
  });

  test("代码块复制按钮测试", async ({ page }) => {
    // 获取剪贴板权限
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.locator(`.${CLASS_PREFIX}-toolbar-item-code`).click();
    await page.keyboard.type("js\nconsole.log('Hello World');");

    const codeBlock = page.locator(".markdown-editor-preview .mini-md-code-container");
    // 点击复制按钮
    await codeBlock.locator(".copy-code-button").click();

    // 等待一段时间确保复制动作完成
    await page.waitForTimeout(500);

    const clipboardText = await page.evaluate(async () => {
      try {
        // 确保页面有权限访问剪贴板
        if (!navigator.clipboard) {
          throw new Error("Clipboard API not available");
        }
        const text = await navigator.clipboard.readText();
        return text;
      } catch (error) {
        console.error("Failed to read clipboard:", error);
        return null;
      }
    });
    expect(clipboardText).toBe("console.log('Hello World');");

    // 清除浏览器上下文的所有权限覆盖
    await page.context().clearPermissions();
  });
});
