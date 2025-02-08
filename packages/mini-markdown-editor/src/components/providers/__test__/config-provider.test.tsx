import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConfigProvider, ConfigContext } from "../config-provider";
import { defaultGlobalConfig } from "@/config/global";
import { GlobalConfig } from "@/types/global-config";
import { useContext } from "react";

// 创建一个测试组件来消费 Context
const TestComponent = () => {
  const config = useContext(ConfigContext);
  return <div data-testid="config-value">{JSON.stringify(config)}</div>;
};

describe("ConfigProvider 组件测试", () => {
  it("应该提供默认的配置", () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );

    const displayedConfig = screen.getByTestId("config-value").textContent;
    expect(displayedConfig).toEqual(JSON.stringify(defaultGlobalConfig));
  });

  it("应该支持自定义配置", () => {
    const customConfig: GlobalConfig = {
      theme: "dark",
      //不需本体存储
      local: false,
    };

    render(
      <ConfigProvider config={customConfig}>
        <TestComponent />
      </ConfigProvider>,
    );

    const displayedConfig = screen.getByTestId("config-value").textContent;
    expect(displayedConfig).toContain('"theme":"dark"');
    expect(displayedConfig).toContain('"local":false');
  });

  it("自定义配置应与默认配置合并", () => {
    const customConfig: Partial<GlobalConfig> = {
      theme: "dark",
    };

    render(
      <ConfigProvider config={customConfig as GlobalConfig}>
        <TestComponent />
      </ConfigProvider>,
    );

    const displayedConfig = screen.getByTestId("config-value").textContent;

    // 确保 "theme" 覆盖默认值
    expect(displayedConfig).toContain('"theme":"dark"');

    // 但其他默认配置仍然存在
    Object.keys(defaultGlobalConfig).forEach((key) => {
      if (key !== "theme") {
        expect(displayedConfig).toContain(`"${key}":`);
      }
    });
  });
});
