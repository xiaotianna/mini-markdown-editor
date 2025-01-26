import styled from "styled-components";
import { DropDownMenu } from "../base/DropDownMenu";
import IconTooltip from "../base/IconTooltip";
import { FC, memo } from "react";
import type { ToolbarItem as ToolbarItemType } from "@/types/toolbar";

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

const ToolbarItemRender: FC<ToolbarItemType> = ({ list, title, icon, onClick, component }) => {
  if (list && list.length > 0) {
    return (
      <>
        <IconTooltip content={title}>
          <DropDownMenu list={list}>
            <img src={icon} alt={title} />
          </DropDownMenu>
        </IconTooltip>
      </>
    );
  } else if (component) {
    return <>{component}</>;
  } else {
    return (
      <>
        <IconTooltip content={title} onClick={onClick}>
          <img src={icon} alt={title} />
        </IconTooltip>
      </>
    );
  }
};

export const ToolbarItem: FC<ToolbarItemType> = memo((props) => {
  return (
    <ToolbarItemWrapper className="item">
      <ToolbarItemRender {...props} />
    </ToolbarItemWrapper>
  );
});
