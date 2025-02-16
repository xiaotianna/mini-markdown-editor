import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { useInitSyncScrollStatus } from "../use-init-sync-scroll-status";
import { SYNC_SCROLL_STATUS } from "@/common";

// 模拟 localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => (store[key] = value)),
    clear: vi.fn(() => (store = {})),
  };
})();

// 模拟安全存储模块
vi.mock("@/utils/storage", () => ({
  safeLocalStorage: () => mockLocalStorage,
}));

describe("useInitSyncScrollStatus Hook测试", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  test("应正确初始化默认状态（无本地存储）", () => {
    const { result } = renderHook(() => useInitSyncScrollStatus());

    expect(result.current.isSyncScroll).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SYNC_SCROLL_STATUS, "true");
  });

  test("应正确读取本地存储中的 true 值", () => {
    mockLocalStorage.setItem(SYNC_SCROLL_STATUS, "true");

    const { result } = renderHook(() => useInitSyncScrollStatus());
    expect(result.current.isSyncScroll).toBe(true);
  });

  test("应正确读取本地存储中的 false 值", () => {
    mockLocalStorage.setItem(SYNC_SCROLL_STATUS, "false");

    const { result } = renderHook(() => useInitSyncScrollStatus());
    expect(result.current.isSyncScroll).toBe(false);
  });

  test("更新状态应同时修改本地存储和状态", () => {
    const { result } = renderHook(() => useInitSyncScrollStatus());

    act(() => {
      result.current.updateSyncScrollStatus(false);
    });

    expect(result.current.isSyncScroll).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SYNC_SCROLL_STATUS, "false");
  });

  test("初始化时应只执行一次存储设置", () => {
    renderHook(() => useInitSyncScrollStatus());
    renderHook(() => useInitSyncScrollStatus()); // 二次渲染

    // 验证 setItem 只调用一次（初始设置）
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
  });

  test("应正确处理非法存储值", () => {
    mockLocalStorage.setItem(SYNC_SCROLL_STATUS, "invalid");

    const { result } = renderHook(() => useInitSyncScrollStatus());
    expect(result.current.isSyncScroll).toBe(true); // 非 false 字符串视为 true
  });
});
