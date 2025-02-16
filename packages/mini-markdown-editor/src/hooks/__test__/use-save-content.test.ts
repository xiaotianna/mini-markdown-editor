import { renderHook, act } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { useSaveContent } from "../use-save-content";
import { EDITOR_CONTENT_KEY } from "@/common";

// 模拟 localStorage
const mockLocalStorage = {
  setItem: vi.fn(),
};

// 模拟依赖项
vi.mock("@/utils/storage", () => ({
  safeLocalStorage: () => mockLocalStorage,
}));

describe("useSaveContent Hook测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockLocalStorage.setItem.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("应在防抖延迟后保存内容", () => {
    const { result } = renderHook(() => useSaveContent());

    act(() => {
      result.current("test-content");
      vi.advanceTimersByTime(299);
    });

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(EDITOR_CONTENT_KEY, "test-content");
  });

  test("多次调用应只执行最后一次保存", () => {
    const { result } = renderHook(() => useSaveContent());

    act(() => {
      result.current("content-1");
      result.current("content-2");
      result.current("final-content");
      vi.advanceTimersByTime(300);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(EDITOR_CONTENT_KEY, "final-content");
  });

  test("应正确处理空内容", () => {
    const { result } = renderHook(() => useSaveContent());

    act(() => {
      result.current("");
      vi.advanceTimersByTime(300);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(EDITOR_CONTENT_KEY, "");
  });

  test("应使用正确的防抖时间", () => {
    const { result } = renderHook(() => useSaveContent());

    act(() => {
      result.current("test-timing");
      vi.advanceTimersByTime(299);
    });
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });
});
