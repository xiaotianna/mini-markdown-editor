import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  createInsertTextHandler,
  createFullScreenHandler,
  createSaveHandler,
  createCustomHandler,
  handleHotkeys,
} from "../handle-hotkeys";
import { BaseToolbarType } from "@/types/toolbar";
import { InsertTextEvent } from "@/config/toolbar/event";
import { useToolbarStore } from "@/store/toolbar";
import { ToolbarItem } from "@/types/toolbar";
import { global } from "../set-global-config";
// 模拟 Zustand store
vi.mock("@/store/toolbar", () => ({
  useToolbarStore: {
    getState: vi.fn(() => ({ isFullScreen: false })),
    setState: vi.fn(),
  },
}));

// 模拟全局对象
vi.mock("../set-global-config", () => ({
  global: {
    saveHotKeyHandle: vi.fn(),
  },
}));

// 模拟事件触发
vi.mock("@/config/toolbar/event", () => ({
  InsertTextEvent: vi.fn(),
}));

describe("handle-hotkeys Utils测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("createInsertTextHandler - 使用自定义处理方法", () => {
    const mockHandle = vi.fn();
    const handler = createInsertTextHandler({
      command: "a",
      description: "插入文本",
      handle: mockHandle,
    });

    expect(handler.run()).toBe(true);
    expect(mockHandle).toHaveBeenCalled();
    expect(InsertTextEvent).not.toHaveBeenCalled();
  });

  test("createInsertTextHandler - 触发默认事件", () => {
    const handler = createInsertTextHandler({
      command: "b",
      description: "插入标题",
    });

    handler.run();
    expect(InsertTextEvent).toHaveBeenCalledWith("插入标题");
  });

  test("createFullScreenHandler - 切换全屏状态", () => {
    const handler = createFullScreenHandler({
      command: "f11",
      description: "全屏",
    });

    handler.run();
    expect(useToolbarStore.setState).toHaveBeenCalledWith({
      isFullScreen: true,
    });
  });

  test("createSaveHandler - 触发保存操作", () => {
    const handler = createSaveHandler({
      command: "ctrl+s",
      description: "保存",
    });

    handler.run();
    expect(global.saveHotKeyHandle).toHaveBeenCalled();
  });

  test("createCustomHandler - 调用自定义处理", () => {
    const mockHandle = vi.fn();
    const handler = createCustomHandler({
      command: "c",
      description: "自定义",
      handle: mockHandle,
    });

    expect(handler.run()).toBe(true);
    expect(mockHandle).toHaveBeenCalled();
  });

  const mockToolbar: ToolbarItem[] = [
    {
      type: BaseToolbarType.FULLSCREEN,
      hotkey: { command: "f", description: "全屏" },
    },
    {
      type: "custom-type",
      hotkey: { command: "c", description: "自定义" },
      list: [
        {
          title: "子项",
          type: "sub-item",
          hotkey: { command: "s", description: "子项" },
        },
      ],
    },
  ];

  test("handleHotkeys - 生成完整热键映射", () => {
    const handlers = handleHotkeys(mockToolbar);
    expect(Object.keys(handlers)).toEqual(["f", "c", "s"]);
    expect(handlers.f.run()).toBe(true);
  });
});
