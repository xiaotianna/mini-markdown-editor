import { describe, test, expect, vi, beforeEach } from "vitest";
import { global } from "../set-global-config";
import type { EditorView } from "@uiw/react-codemirror";
import type { GlobalConfig } from "@/types/global-config";

// 模拟 EditorView 实例
const mockEditorView = {
  state: {
    doc: {
      toString: vi.fn(() => "test content"),
    },
  },
} as unknown as EditorView;

describe("set-global-config Utils测试", () => {
  beforeEach(() => {
    // 重置单例状态
    global["config"] = {};
    global["view"] = null;
  });

  describe("setGlobalConfig", () => {
    test("应正确设置配置和视图", () => {
      const config: GlobalConfig = { theme: "dark" };

      global.setGlobalConfig(config, mockEditorView);

      expect(global["config"]).toEqual(config);
      expect(global["view"]).toBe(mockEditorView);
    });

    test("应覆盖现有配置", () => {
      global.setGlobalConfig({ theme: "light" }, mockEditorView);
      global.setGlobalConfig({ local: false }, mockEditorView);

      expect(global["config"]).toEqual({ local: false });
    });
  });

  describe("saveHotKeyHandle", () => {
    test("无视图时应跳过处理", () => {
      const consoleSpy = vi.spyOn(console, "error");

      global.saveHotKeyHandle();

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("有视图但无内容时应跳过回调", () => {
      const mockEmptyView = {
        state: { doc: { toString: () => "" } },
      } as EditorView;
      const onSave = vi.fn();

      global.setGlobalConfig({ onSave }, mockEmptyView);
      global.saveHotKeyHandle();

      expect(onSave).not.toHaveBeenCalled();
    });

    test("有内容时应触发 onSave 回调", () => {
      const onSave = vi.fn();

      global.setGlobalConfig({ onSave }, mockEditorView);
      global.saveHotKeyHandle();

      expect(onSave).toHaveBeenCalledWith("test content", mockEditorView);
    });

    test("应正确处理未定义的回调", () => {
      global.setGlobalConfig({}, mockEditorView);

      expect(() => global.saveHotKeyHandle()).not.toThrow();
    });
  });
});
