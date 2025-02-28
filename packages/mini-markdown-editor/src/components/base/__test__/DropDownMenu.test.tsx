import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropDownMenu } from "../DropDownMenu";
import type { ToolbarItemListItem } from "@/types/toolbar";

//测试数据
const getName = vi.fn(); //虚拟函数
const testList: ToolbarItemListItem[] = [
  {
    title: "H1 一级标题",
    type: "heading-1",
    onClick: () => getName.mockReturnValueOnce("heading-1"),
  },
  {
    title: "H2 二级标题",
    type: "heading-2",
    onClick: () => getName.mockReturnValueOnce("heading-2"),
  },
];

describe("DropDownMenu 组件测试", () => {
  it("正确渲染菜单标题", () => {
    render(
      <DropDownMenu list={testList}>
        <button>heading</button>
      </DropDownMenu>,
    );
    expect(screen.getByRole("button", { name: "heading" })).toBeInTheDocument();
  });

  it("鼠标悬停应出现菜单项", async () => {
    render(
      <DropDownMenu list={testList}>
        <button>heading</button>
      </DropDownMenu>,
    );
    const button = screen.getByRole("button", { name: "heading" });
    fireEvent.mouseOver(button);
    //由于菜单异步出现，故要等待
    await waitFor(() => {
      testList.forEach((item) => {
        expect(screen.getByText(item.title!)).toBeInTheDocument();
      });
    });
  });

  it("菜单项能响应点击事件", async () => {
    render(
      <DropDownMenu list={testList}>
        <button>heading</button>
      </DropDownMenu>,
    );
    const button = screen.getByRole("button", { name: "heading" });
    fireEvent.mouseOver(button);

    //由于菜单异步出现，故要等待
    await waitFor(() => {
      testList.forEach((item) => {
        expect(screen.getByText(item.title!)).toBeInTheDocument();
      });
    });

    testList.forEach(async (item) => {
      fireEvent.mouseOver(button);
      const menuItem = screen.getByText(item.title!);
      fireEvent.click(menuItem);

      //同样需要等待
      await waitFor(() => {
        expect(getName).toHaveBeenCalled();
        expect(getName).toHaveReturnedWith(item.type);
      });
    });
  });
  it("正确渲染自定义菜单项", () => {
    const custom = () => <div>custom</div>;
    render(
      <DropDownMenu dropdownRender={custom}>
        <button>heading</button>
      </DropDownMenu>,
    );
    const button = screen.getByRole("button", { name: "heading" });
    fireEvent.mouseOver(button);
    //同样需要等待
    waitFor(() => {
      expect(screen.getByText("custom")).toBeInTheDocument();
    });
  });
});
