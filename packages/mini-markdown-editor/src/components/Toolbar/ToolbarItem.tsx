import styled from "styled-components";
import { DropDownMenu } from "../base/DropDownMenu";
import IconTooltip from "../base/IconTooltip";
import { FC, memo } from "react";
import { ToolbarItemListItem, ToolbarType } from "@/types/toolbar";

const ToolbarItemWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: content-box;
  padding: 3px;
  border-radius: 3px;
  margin: 0 2px;
  transition: all 0.3s;
  &:hover {
    background-color: #e6e6e6;
  }
  img {
    width: 16px;
    height: 16px;
    display: block;
    flex-shrink: 0;
  }
`;

interface ToolbarItemProps {
  icon: string | undefined;
  title: string | undefined;
  type: ToolbarType;
  list?: Array<ToolbarItemListItem>;
  onClick?: (...args: any[]) => void | (() => void);
  hotkey?: string;
}

export const ToolbarItem: FC<ToolbarItemProps> = memo(({ icon, title, list, onClick }) => {
  return (
    <ToolbarItemWrapper className="item" onClick={list ? undefined : onClick}>
      {list ? (
        <IconTooltip content={title}>
          <DropDownMenu list={list}>
            <img src={icon} alt={title} />
          </DropDownMenu>
        </IconTooltip>
      ) : (
        <IconTooltip content={title}>
          <img src={icon} alt={title} />
        </IconTooltip>
      )}
    </ToolbarItemWrapper>
  );
});
