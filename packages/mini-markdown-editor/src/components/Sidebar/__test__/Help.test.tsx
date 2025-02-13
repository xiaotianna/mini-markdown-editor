import { render, waitFor } from "@testing-library/react";
import Help from "../Help";
import { grammar, shortcuts } from "@/common/help";
import { describe, it, expect } from "vitest";

describe("Help 组件测试", () => {
  it("应该正常渲染", () => {
    const { getByText } = render(<Help />);

    expect(getByText("Markdown 语法")).toBeInTheDocument();
    expect(getByText("快捷键")).toBeInTheDocument();
  });

  it("应该渲染语法规则", () => {
    const { getByText } = render(<Help />);

    grammar.forEach((rule) => {
      waitFor(() => {
        expect(getByText(rule.title)).toBeInTheDocument();
        expect(getByText(rule.rule)).toBeInTheDocument();
      });
    });
  });

  it("应该渲染快捷键", () => {
    const { getByText } = render(<Help />);

    shortcuts.forEach((shortcut) => {
      waitFor(() => {
        expect(getByText(shortcut.title)).toBeInTheDocument();
        expect(getByText(shortcut.rule)).toBeInTheDocument();
      });
    });
  });
});
