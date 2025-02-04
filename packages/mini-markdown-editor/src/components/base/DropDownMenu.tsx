import React, { useMemo, memo } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ToolbarItemListItem } from "@/types/toolbar";
import { render, renderKey } from "@/config/toolbar/base";

interface DropDownMenuProps {
  children: React.ReactNode;
  list?: ToolbarItemListItem[];
  dropdownRender?: () => React.ReactNode;
}

export const DropDownMenu = memo(({ children, list, dropdownRender }: DropDownMenuProps) => {
  // list
  const items: MenuProps["items"] = useMemo(() => {
    if (!list) return undefined;

    const renderKeys = Object.keys(render) as renderKey[];
    return list.map((item) => {
      return {
        key: item.title,
        label: renderKeys.includes(item.type as renderKey)
          ? render[item.type as renderKey]
          : item.title,
      };
    });
  }, [list]);
  // 处理 list 的点击事件
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (!list) return;

    const key = e.key;
    const item = list.find((item) => item.title === key);
    if (item?.onClick) {
      item.onClick();
    }
  };

  // 如果提供了自定义渲染函数（组件）
  if (dropdownRender) {
    return (
      <Dropdown dropdownRender={dropdownRender} placement="bottomLeft">
        {children}
      </Dropdown>
    );
  }

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      placement="bottomLeft"
    >
      {children}
    </Dropdown>
  );
});
