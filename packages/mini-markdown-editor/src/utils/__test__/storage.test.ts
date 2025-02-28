import { describe, test, expect, vi, beforeEach, afterAll } from "vitest";
import { safeLocalStorage } from "../storage";

// 模拟 localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

describe("safeLocalStorage", () => {
  let originalLocalStorage: Storage;
  const consoleError = vi.spyOn(console, "error");
  const consoleWarn = vi.spyOn(console, "warn");

  beforeEach(() => {
    // 重置模拟 localStorage
    mockLocalStorage.clear();
    vi.clearAllMocks();

    // 保存原始 localStorage 引用
    originalLocalStorage = window.localStorage;
    (window as any).localStorage = mockLocalStorage;
  });

  afterAll(() => {
    // 恢复原始 localStorage
    (window as any).localStorage = originalLocalStorage;
  });

  describe("正常环境测试", () => {
    test("存储并获取字符串值", () => {
      const storage = safeLocalStorage();
      storage.setItem("test", "value");
      expect(storage.getItem("test")).toBe("value");
    });

    test("存储并获取对象", () => {
      const storage = safeLocalStorage();
      const data = { name: "test", count: 42 };
      storage.setItem("obj", data);
      expect(storage.getItem<typeof data>("obj")).toEqual(data);
    });

    test("移除单个项", () => {
      const storage = safeLocalStorage();
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      storage.removeItem("key1");
      expect(storage.getItem("key1")).toBeNull();
      expect(storage.getItem("key2")).toBe("value2");
    });

    test("清空所有存储", () => {
      const storage = safeLocalStorage();
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      storage.clear();
      expect(storage.getItem("key1")).toBeNull();
      expect(storage.getItem("key2")).toBeNull();
    });
  });

  describe("异常处理测试", () => {
    test("不可用的 localStorage", () => {
      // 模拟 localStorage 不可用
      (window as any).localStorage = null;

      const storage = safeLocalStorage();
      storage.setItem("test", "value");
      expect(storage.getItem("test")).toBeNull();
      storage.removeItem("test");
      storage.clear();
      expect(consoleWarn).toHaveBeenCalledTimes(4);
    });

    test("损坏的 JSON 数据", () => {
      const storage = safeLocalStorage();
      mockLocalStorage.setItem("badData", "{invalid json");
      expect(storage.getItem("badData")).toBeNull();
      expect(consoleError).toHaveBeenCalledWith("Failed to deserialize value:", expect.any(Error));
    });

    test("无法序列化的数据", () => {
      const storage = safeLocalStorage();
      const circularRef: any = {};
      circularRef.self = circularRef;

      storage.setItem("circular", circularRef);
      expect(mockLocalStorage.getItem("circular")).toBe("[object Object]");
      expect(consoleError).toHaveBeenCalledWith("Failed to serialize value:", expect.any(Error));
    });
  });

  describe("边界条件测试", () => {
    test("存储空值", () => {
      const storage = safeLocalStorage();
      storage.setItem("empty", null as any);
      expect(storage.getItem("empty")).toBeNull();
    });

    test("获取不存在的键", () => {
      const storage = safeLocalStorage();
      expect(storage.getItem("nonExistent")).toBeNull();
    });

    test("存储特殊类型", () => {
      const storage = safeLocalStorage();
      const date = new Date();
      storage.setItem("date", date);
      expect(storage.getItem<Date>("date")).toBe(date.toISOString());
    });
  });
});
