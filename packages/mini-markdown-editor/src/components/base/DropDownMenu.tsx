import React, { useMemo, memo } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

interface DropDownMenuProps {
  children: React.ReactNode;
  list: string[];
  onSelect?: (key: string) => void;
}

export const DropDownMenu = memo(({ children, list, onSelect }: DropDownMenuProps) => {
  const items: MenuProps["items"] = useMemo(() => {
    return list.map((item) => ({
      key: item,
      label: item,
    }));
  }, [list]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onSelect?.(e.key);
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
