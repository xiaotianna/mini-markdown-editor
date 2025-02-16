import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useToolbar } from "../use-toolbar";
import { type ReactNode } from "react";
import { ToolbarContext } from "@/components/providers/toolbar-provider";
import { ToolbarContextValues } from "@/types/toolbar";

// 测试用 Provider 组件
const MockProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: ToolbarContextValues;
}) => <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;

describe("useToolbar Hook测试", () => {
  test("当存在 ToolbarProvider 时返回有效上下文", () => {
    const expectedValue: ToolbarContextValues = { toolbars: [{ type: "file" }] };

    const { result } = renderHook(() => useToolbar(), {
      wrapper: ({ children }) => <MockProvider value={expectedValue}>{children}</MockProvider>,
    });

    expect(result.current).toEqual(expectedValue);
  });

  test("当缺少 ToolbarProvider 时抛出指定错误", () => {
    // 禁用 React 的错误日志避免测试输出混乱
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => null);

    expect(() => {
      renderHook(() => useToolbar()); // 不包裹 Provider
    }).toThrowError("Toolbar init error");

    consoleError.mockRestore();
  });

  test("应响应上下文值的更新", () => {
    const initialValue: ToolbarContextValues = { toolbars: [{ type: "file" }] };
    const updatedValue: ToolbarContextValues = { toolbars: [{ type: "file" }, { type: "edit" }] };

    const { result, rerender } = renderHook(() => useToolbar(), {
      wrapper: ({ children }) => <MockProvider value={initialValue}>{children}</MockProvider>,
    });

    // 验证初始值
    expect(result.current).toEqual(initialValue);

    // 更新 Provider 值并重新渲染
    rerender({
      wrapper: ({ children }: { children: ReactNode }) => (
        <MockProvider value={updatedValue}>{children}</MockProvider>
      ),
    });

    waitFor(() => {
      // 验证更新后的值
      expect(result.current).toEqual(updatedValue);
    });
  });
});
