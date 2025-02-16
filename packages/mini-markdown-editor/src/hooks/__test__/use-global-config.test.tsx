import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { type ReactNode, createContext } from "react";
import { useGlobalConfig } from "../use-global-config";
import { ConfigContext } from "@/components/providers/config-provider";

// 模拟原始上下文提供者（需保持与源码相同的Context对象）
vi.mock("@/components/providers/config-provider", () => ({
  ConfigContext: createContext<MockConfig | undefined>(undefined),
}));

// 创建模拟上下文类型
type MockConfig = { theme: "light" | "dark" };

// 测试用 Provider 组件
const MockProvider = ({ children, value }: { children: ReactNode; value: MockConfig }) => (
  <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
);

describe("useGlobalConfig Hook测试", () => {
  test("当存在 ConfigProvider 时返回有效上下文", () => {
    const expectedConfig: MockConfig = { theme: "dark" };

    const { result } = renderHook(() => useGlobalConfig(), {
      wrapper: ({ children }) => <MockProvider value={expectedConfig}>{children}</MockProvider>,
    });

    expect(result.current).toEqual(expectedConfig);
  });

  test("当缺少 ConfigProvider 时抛出指定错误", () => {
    // 禁用 React 的错误日志避免测试输出混乱
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => null);

    expect(() => {
      renderHook(() => useGlobalConfig()); // 不包裹 Provider
    }).toThrowError("GlobalConfig init error");

    consoleError.mockRestore();
  });

  test("应响应上下文更新", () => {
    const initialConfig: MockConfig = { theme: "light" };
    const updatedConfig: MockConfig = { theme: "dark" };

    const { result, rerender } = renderHook(() => useGlobalConfig(), {
      wrapper: ({ children }) => <MockProvider value={initialConfig}>{children}</MockProvider>,
    });

    // 初始值验证
    expect(result.current).toEqual(initialConfig);

    // 更新 Provider 值
    act(() => {
      rerender({
        wrapper: ({ children }: { children: ReactNode }) => (
          <MockProvider value={updatedConfig}>{children}</MockProvider>
        ),
      });
    });
    waitFor(() => {
      // 验证更新后的值
      expect(result.current).toEqual(updatedConfig);
    });
  });
});
