import { CLASS_PREFIX } from "@/common";
import { expect, test } from "playwright/test";
import fs from "fs";

test.describe("Toolbar E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("工具栏是否被渲染", async ({ page }) => {
    const toolbar = await page.waitForSelector(`.${CLASS_PREFIX}-toolbar-content`);
    expect(toolbar, "工具栏").toBeTruthy();
  });

  test("工具栏下拉菜单功能测试", async ({ page }) => {
    const toolbarItem = page.locator(`.ant-dropdown-trigger`).first();
    await toolbarItem.hover();

    const dropdownMenu = toolbarItem.locator(`.ant-dropdown-open`);
    expect(dropdownMenu, "下拉菜单").toBeTruthy();

    const dropdownItem = await page.waitForSelector(`.${CLASS_PREFIX}-dropdown-menu`);
    expect(dropdownItem, "下拉菜单每一项").toBeTruthy();
  });

  test("工具栏加粗功能测试", async ({ page }) => {
    const toolbarItem = page.locator(`.${CLASS_PREFIX}-toolbar-item-bold`);
    await toolbarItem.click();

    // 测试加粗功能
    const editor = page.locator(".markdown-editor-content");
    await expect(editor).toContainText("****");

    await page.keyboard.type("加粗文本");
    // 验证预览区域是否正确渲染
    const preview = page.locator(".markdown-editor-preview");
    const p = await preview.locator("p").innerHTML();
    expect(p).toContain("<strong>加粗文本</strong>");
  });

  test("工具栏撤销、重做功能测试", async ({ page }) => {
    await expect(page.locator(".markdown-editor-content")).toBeVisible();
    const undo = page.locator(`.${CLASS_PREFIX}-toolbar-item-undo`);
    const redo = page.locator(`.${CLASS_PREFIX}-toolbar-item-redo`);

    // 测试输入文本
    const editor = page.locator(".markdown-editor-content");
    await editor.click();
    await page.keyboard.type("测试文本");

    // 测试撤销功能
    await undo.click();
    await expect(editor).toContainText("");
    // 测试重做功能
    await redo.click();
    await expect(editor).toContainText("测试文本");
  });

  test("工具栏全屏功能测试", async ({ page }) => {
    const fullsrceen = page.locator(`.${CLASS_PREFIX}-toolbar-item-fullscreen`);
    await fullsrceen.click();
    expect(page.locator(".md-editor-fullscreen")).toBeTruthy();
  });

  test("文件导出测试", async ({ page }) => {
    // 输入一些内容
    const editor = page.locator(".markdown-editor-content");
    await editor.click();
    await page.keyboard.type("测试文本");

    // 点击导出按钮
    const output = page.locator(`.${CLASS_PREFIX}-toolbar-item-output`);
    await output.click();

    // 等待导出按钮出现并确保其可见和可交互
    const sidebar = page.locator(`.${CLASS_PREFIX}-sidebar-output`);
    const exportButton = sidebar.getByRole("button", { name: "导 出" });
    await expect(exportButton).toBeVisible();

    // 开始监听下载事件并点击导出按钮
    const downloadPromise = page.waitForEvent("download");
    await exportButton.click();
    const download = await downloadPromise;

    // 获取下载文件的路径
    const savePath = `${process.cwd()}/test-downloads/${download.suggestedFilename()}`;
    await download.saveAs(savePath);
    expect(fs.existsSync(savePath)).toBeTruthy();

    // 清理测试文件
    fs.unlinkSync(savePath);
  });
});
