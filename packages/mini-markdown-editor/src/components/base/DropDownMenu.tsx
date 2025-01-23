import { Dropdown, Menu } from "@arco-design/web-react";
import React from "react";

interface DropDownMenuProps {
  children: React.ReactNode;
  list: string[];
  onSelect?: (key: string) => void;
}

export const DropDownMenu = ({ children, list, onSelect }: DropDownMenuProps) => {
  // TODO: 处理不同的点击事件
  const handleMenuItemClick = (key: string) => {
    onSelect?.(key);
  };

  const dropList = (
    <Menu onClickMenuItem={handleMenuItemClick}>
      {list.map((item, index) => (
        <Menu.Item key={index.toString()}>{item}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown droplist={dropList} position="bl">
      {children}
    </Dropdown>
  );
};
