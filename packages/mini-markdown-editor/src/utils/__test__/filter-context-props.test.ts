import { describe, test, expect, vi } from "vitest";
import { filterContextProps } from "../filter-context-props";
import type { GlobalConfig } from "@/types/global-config";

// 模拟默认配置
vi.mock("@/config/global", () => ({
  defaultGlobalConfig: {
    theme: "light",
    language: "en",
    fontSize: 14,
  },
}));

describe("filterContextProps Utils测试", () => {
  // 基础功能测试
  test("应过滤上下文属性并保留 className/style", () => {
    const inputProps = {
      theme: "dark", // 在 defaultGlobalConfig 中的上下文属性
      isSyncScroll: true, // 显式添加的上下文属性
      value: "test", // 显式添加的上下文属性
      className: "editor",
      style: { padding: 8 },
      customProp: "保留我", // 应保留的普通属性
    } as unknown as GlobalConfig;

    const result = filterContextProps(inputProps);

    expect(result).toEqual({
      className: "editor",
      style: { padding: 8 },
      customProp: "保留我",
    });
  });

  // 边界情况测试
  test("处理空 props 时应返回空对象", () => {
    const result = filterContextProps({} as GlobalConfig);
    expect(result).toEqual({
      className: undefined,
      style: undefined,
    });
  });

  // 特殊属性保留测试
  test("应始终保留 className 和 style", () => {
    const inputProps = {
      className: "special",
      style: { margin: 0 },
      theme: "light", // 上下文属性
    } as GlobalConfig;

    const result = filterContextProps(inputProps);
    expect(result).toEqual({
      className: "special",
      style: { margin: 0 },
    });
  });

  // 动态添加键测试
  test("应过滤显式添加的 isSyncScroll 和 value", () => {
    const inputProps = {
      isSyncScroll: false,
      value: "content",
      customProp: "保留我", // 应保留的普通属性
    } as unknown as GlobalConfig;

    const result = filterContextProps(inputProps);
    expect(result).toEqual({
      className: undefined,
      style: undefined,
      customProp: "保留我", // 应保留的普通属性
    });
  });

  // 非上下文属性保留测试
  test("应保留非上下文属性", () => {
    const inputProps = {
      readOnly: true,
      placeholder: "输入内容...",
      className: "form-control",
    } as GlobalConfig;

    const result = filterContextProps(inputProps);
    expect(result).toEqual({
      className: "form-control",
      style: undefined,
      readOnly: true,
      placeholder: "输入内容...",
    });
  });
});
