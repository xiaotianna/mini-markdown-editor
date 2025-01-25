import React, { useMemo, memo } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ToolbarItemListItem } from "@/types/toolbar";
import { render, renderKey } from "@/config/toolbar/base";

interface DropDownMenuProps {
  children: React.ReactNode;
  list: ToolbarItemListItem[];
}

export const DropDownMenu = memo(({ children, list }: DropDownMenuProps) => {
  const items: MenuProps["items"] = useMemo(() => {
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

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const key = e.key;
    const item = list.filter((item) => item.title === key)[0];
    if (item && item.onClick) {
      item.onClick();
    }
  };

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
