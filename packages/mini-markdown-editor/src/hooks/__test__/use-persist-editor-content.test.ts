import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { usePersistEditorContent } from "../use-persist-editor-content";
import { EDITOR_CONTENT_KEY } from "@/common";
import { useGlobalConfig } from "../use-global-config";
// 模拟依赖项
vi.mock("@/utils/storage", () => ({
  safeLocalStorage: () => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

vi.mock("../use-global-config", () => ({
  useGlobalConfig: vi.fn(() => ({
    local: true,
    value: "global-value",
  })),
}));

vi.mock("ahooks", () => ({
  useDebounceFn: (fn: any, options: any) => ({
    run: vi.fn((...args) => {
      setTimeout(() => fn(...args), options.wait);
    }),
  }),
}));

describe("usePersistEditorContent Hook测试", () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // 重置模拟实现
    mockLocalStorage.getItem.mockImplementation(() => null);
    vi.mocked(useGlobalConfig).mockImplementation(() => ({
      local: true,
      value: "global-value",
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("当 local=true 时应保存到 localStorage", async () => {
    const { result } = renderHook(() => usePersistEditorContent());

    act(() => {
      result.current.saveContent("test-content");
      vi.advanceTimersByTime(300);
    });
    waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(EDITOR_CONTENT_KEY, "test-content");
    });
  });

  test("当 local=false 时不应保存到 localStorage", () => {
    vi.mocked(useGlobalConfig).mockReturnValue({ local: false, value: "" });
    const { result } = renderHook(() => usePersistEditorContent());

    act(() => {
      result.current.saveContent("test-content");
      vi.advanceTimersByTime(300);
    });
    waitFor(() => {
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  test("防抖功能应正确生效", () => {
    const { result } = renderHook(() => usePersistEditorContent());

    act(() => {
      result.current.saveContent("first");
      result.current.saveContent("second");
      vi.advanceTimersByTime(299);
    });

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1); // 累计 300ms
    });
    waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(EDITOR_CONTENT_KEY, "second");
    });
  });

  test("当 local=false 且存在 value 时应返回全局值", () => {
    vi.mocked(useGlobalConfig).mockReturnValue({
      local: false,
      value: "custom-value",
    });

    const { result } = renderHook(() => usePersistEditorContent());
    expect(result.current.getContent()).toBe("custom-value");
  });

  test("当 local=true 时应返回 localStorage 值", () => {
    mockLocalStorage.getItem.mockReturnValue("stored-content");
    const { result } = renderHook(() => usePersistEditorContent());
    waitFor(() => {
      expect(result.current.getContent()).toBe("stored-content");
    });
  });

  test("当存储为空时应返回空字符串", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => usePersistEditorContent());
    expect(result.current.getContent()).toBe("");
  });
});
