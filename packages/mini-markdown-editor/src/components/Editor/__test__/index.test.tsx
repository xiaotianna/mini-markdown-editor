import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Editor from "../index";

describe("Editor 组件测试", () => {
  test("测试组件渲染", async () => {
    // 渲染组件
    const dom = await render(<Editor isSyncScroll />);
    // 是否符合预期
    expect(dom).toBeTruthy();
    //...省略
  });
});
