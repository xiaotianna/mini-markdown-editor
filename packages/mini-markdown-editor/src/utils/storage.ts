/**
 * localStorage 包装器
 */
export interface SafeStorage {
  getItem: <T = string>(key: string) => T | null;
  setItem: <T = string>(key: string, value: T) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

export function safeLocalStorage(): SafeStorage {
  //* 使用闭包存储storage状态
  const getStorage = (): Storage | null => {
    try {
      // 检查localStorage是否可用
      if (typeof window !== "undefined" && window.localStorage) {
        const testKey = "__storage_test__";
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return window.localStorage;
      }
    } catch (e) {
      console.error("localStorage is not available:", e);
    }
    return null;
  };

  // 缓存storage实例
  const storage = getStorage();

  // 统一的错误处理
  const handleStorageError = (operation: string, key?: string) => {
    const message = key
      ? `Attempted to ${operation} "${key}" ${operation === "get" ? "from" : "in"} localStorage, but localStorage is not available.`
      : `Attempted to ${operation} localStorage, but localStorage is not available.`;
    console.warn(message);
  };

  // 序列化和反序列化数据
  const serialize = <T>(value: T): string => {
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.error("Failed to serialize value:", e);
      return String(value);
    }
  };
  const deserialize = <T>(value: string): T | null => {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      console.error("Failed to deserialize value:", e);
      return null;
    }
  };

  return {
    // 提取数据
    getItem<T = string>(key: string): T | null {
      if (!storage) {
        handleStorageError("get", key);
        return null;
      }

      try {
        const value = storage.getItem(key);
        return value ? deserialize<T>(value) : null;
      } catch (e) {
        console.error(`Error getting item "${key}" from localStorage:`, e);
        return null;
      }
    },

    // 存储数据
    setItem<T = string>(key: string, value: T): void {
      if (!storage) {
        handleStorageError("set", key);
        return;
      }

      try {
        storage.setItem(key, serialize(value));
      } catch (e) {
        console.error(`Error setting item "${key}" in localStorage:`, e);
        // TODO: 处理超额存储
      }
    },

    // 删除指定数据项
    removeItem(key: string): void {
      if (!storage) {
        handleStorageError("remove", key);
        return;
      }

      try {
        storage.removeItem(key);
      } catch (e) {
        console.error(`Error removing item "${key}" from localStorage:`, e);
      }
    },

    // 清空所有数据项
    clear(): void {
      if (!storage) {
        handleStorageError("clear");
        return;
      }

      try {
        storage.clear();
      } catch (e) {
        console.error("Error clearing localStorage:", e);
      }
    },
  };
}
