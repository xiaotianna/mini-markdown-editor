import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ConfigContext, ConfigProvider } from "../config-provider";
import { defaultGlobalConfig } from "@/config/global";
import type { GlobalConfig } from "@/types/global-config";
import { useContext } from "react";

// 测试用消费者组件
const ConfigConsumer = () => {
  const config = useContext(ConfigContext);
  return (
    <div>
      <span data-testid="theme">{config.theme}</span>
      <span data-testid="locale">{config.locale}</span>
    </div>
  );
};

describe("ConfigProvider Provider测试", () => {
  // 测试默认配置
  test("应提供默认配置", () => {
    render(
      <ConfigProvider>
        <ConfigConsumer />
      </ConfigProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent(defaultGlobalConfig.theme!);
    expect(screen.getByTestId("locale")).toHaveTextContent(defaultGlobalConfig.locale!);
  });

  // 测试自定义配置合并
  test("应合并自定义配置", () => {
    const customConfig: GlobalConfig = {
      theme: "dark",
    };

    render(
      <ConfigProvider config={customConfig}>
        <ConfigConsumer />
      </ConfigProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("locale")).toHaveTextContent(defaultGlobalConfig.locale!);
  });

  // 测试空配置处理
  test("应处理空配置", () => {
    render(
      <ConfigProvider config={{}}>
        <ConfigConsumer />
      </ConfigProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent(defaultGlobalConfig.theme!);
    expect(screen.getByTestId("locale")).toHaveTextContent(defaultGlobalConfig.locale!);
  });

  // 测试深层属性覆盖
  test("应深度合并配置", () => {
    const customConfig = {
      toolbars: {
        addTools: [],
        excludeTools: [],
      },
    } as GlobalConfig;

    const TestComponent = () => {
      const config = useContext(ConfigContext);
      return <span data-testid="editor">{JSON.stringify(config.toolbars)}</span>;
    };

    render(
      <ConfigProvider config={customConfig}>
        <TestComponent />
      </ConfigProvider>,
    );

    const expected = {
      ...defaultGlobalConfig.toolbars,
      ...customConfig.toolbars,
    };

    expect(screen.getByTestId("editor")).toHaveTextContent(JSON.stringify(expected));
  });
});
