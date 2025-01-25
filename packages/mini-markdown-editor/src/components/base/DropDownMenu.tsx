import React, { useMemo, memo } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ToolbarItemListItem } from "@/types/toolbar";

interface DropDownMenuProps {
  children: React.ReactNode;
  list: ToolbarItemListItem[];
}

export const DropDownMenu = memo(({ children, list }: DropDownMenuProps) => {
  const items: MenuProps["items"] = useMemo(() => {
    return list.map((item) => ({
      key: item.title,
      label: item.title,
    }));
  }, [list]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const key = e.key;
    const item = list.filter((item) => item.title === key)[0];
    item.onClick();
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
