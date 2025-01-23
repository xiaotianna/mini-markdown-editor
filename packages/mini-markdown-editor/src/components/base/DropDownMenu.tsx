import { Dropdown, Menu } from "@arco-design/web-react";
import React, { useCallback, useMemo, memo } from "react";

interface DropDownMenuProps {
  children: React.ReactNode;
  list: string[];
  onSelect?: (key: string) => void;
}

export const DropDownMenu = memo(({ children, list, onSelect }: DropDownMenuProps) => {
  const handleMenuItemClick = useCallback(
    (key: string) => {
      onSelect?.(key);
    },
    [onSelect],
  );

  const dropList = useMemo(
    () => (
      <Menu onClickMenuItem={handleMenuItemClick}>
        {list.map((item) => (
          <Menu.Item key={item}>{item}</Menu.Item>
        ))}
      </Menu>
    ),
    [list, handleMenuItemClick],
  );

  return (
    <Dropdown droplist={dropList} position="bl">
      {children}
    </Dropdown>
  );
});
