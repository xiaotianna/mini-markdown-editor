import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";
import IconTooltip from "../IconTooltip";

//模拟点击函数
const handleClick = vi.fn();
//测试数据
const testIcon = {
  type: "bold",
  //假设是icon svg
  icon: '<svg data-testid="bold-icon"></svg>',
  title: "加粗",
  description: "the hotkey",
  onClick: handleClick,
};

describe("IconTooltip 组件测试", () => {
  it("正确渲染组件", () => {
    render(
      <IconTooltip
        content={testIcon.title}
        description={testIcon.description}
        onClick={testIcon.onClick}
      >
        {/* <img src={icon} alt={title} /> */}
        {testIcon.icon && (
          <div className="icon" dangerouslySetInnerHTML={{ __html: testIcon.icon }}></div>
        )}
      </IconTooltip>,
    );
    expect(screen.getByTestId("bold-icon")).toBeInTheDocument();
  });

  it("鼠标悬停出现tip", async () => {
    render(
      <IconTooltip
        content={testIcon.title}
        description={testIcon.description}
        onClick={testIcon.onClick}
      >
        {/* <img src={icon} alt={title} /> */}
        {testIcon.icon && (
          <div className="icon" dangerouslySetInnerHTML={{ __html: testIcon.icon }}></div>
        )}
      </IconTooltip>,
    );
    const icon = screen.getByTestId("bold-icon");
    expect(icon).toBeInTheDocument();

    fireEvent.mouseOver(icon);
    //异步出现tip
    await waitFor(() => {
      expect(screen.getByText(testIcon.title)).toBeInTheDocument();
      expect(screen.getByText(testIcon.description)).toBeInTheDocument();
    });
  });

  it("能响应点击事件", () => {
    render(
      <IconTooltip
        content={testIcon.title}
        description={testIcon.description}
        onClick={testIcon.onClick}
      >
        {/* <img src={icon} alt={title} /> */}
        {testIcon.icon && (
          <div className="icon" dangerouslySetInnerHTML={{ __html: testIcon.icon }}></div>
        )}
      </IconTooltip>,
    );
    const icon = screen.getByTestId("bold-icon");
    expect(icon).toBeInTheDocument();

    fireEvent.click(icon);
    expect(handleClick).toHaveBeenCalled();
  });
});
