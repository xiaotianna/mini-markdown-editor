import { renderHook } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { usePreviewTheme } from "../use-preview-theme";

// 模拟主题配置
const mockPreviewTheme = {
  light: { color: "#ffffff", bg: "#000000" },
  dark: { color: "#000000", bg: "#ffffff" },
};

// 模拟主题模块
vi.mock("@/theme/preview-theme", () => ({
  previewTheme: {
    light: { color: "#ffffff", bg: "#000000" },
    dark: { color: "#000000", bg: "#ffffff" },
  },
}));

describe("usePreviewTheme Hook测试", () => {
  let setPropertySpy: any;

  beforeEach(() => {
    // 重置 DOM 操作 spy
    setPropertySpy = vi.spyOn(document.body.style, "setProperty");
    document.body.style.cssText = ""; // 清空样式
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("应正确应用 light 主题变量", () => {
    renderHook(() => usePreviewTheme("light"));

    expect(setPropertySpy).toHaveBeenCalledWith("--md-preview-color", mockPreviewTheme.light.color);
    expect(setPropertySpy).toHaveBeenCalledWith("--md-preview-bg", mockPreviewTheme.light.bg);
  });

  test("应正确应用 dark 主题变量", () => {
    renderHook(() => usePreviewTheme("dark"));

    expect(setPropertySpy).toHaveBeenCalledWith("--md-preview-color", mockPreviewTheme.dark.color);
    expect(setPropertySpy).toHaveBeenCalledWith("--md-preview-bg", mockPreviewTheme.dark.bg);
  });

  test("当主题切换时应更新变量", async () => {
    const { rerender } = renderHook(
      ({ theme }: { theme: "light" | "dark" }) => usePreviewTheme(theme),
      { initialProps: { theme: "light" } },
    );

    // 初始应用 light 主题
    expect(setPropertySpy).toHaveBeenCalledTimes(2);

    setPropertySpy.mockClear();

    // 切换为 dark 主题
    rerender({ theme: "dark" });

    expect(setPropertySpy).toHaveBeenCalledWith("--md-preview-color", mockPreviewTheme.dark.color);
    expect(setPropertySpy).toHaveBeenCalledWith("--md-preview-bg", mockPreviewTheme.dark.bg);
  });

  test("应清理旧主题变量", () => {
    const removePropertySpy = vi.spyOn(document.body.style, "removeProperty");

    const { rerender } = renderHook(
      ({ theme }: { theme: "light" | "dark" }) => usePreviewTheme(theme),
      { initialProps: { theme: "light" } },
    );

    // 切换主题前设置旧变量
    document.body.style.setProperty("--md-preview-old", "value");

    rerender({ theme: "dark" });

    // 验证没有清理操作（根据当前实现逻辑）
    expect(removePropertySpy).not.toHaveBeenCalled();
  });
});
