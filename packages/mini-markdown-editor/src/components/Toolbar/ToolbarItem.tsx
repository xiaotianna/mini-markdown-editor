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
    /* background-color: #e6e6e6; */
    background-color: ${(props) => props.theme.toolbarHoverBg};
  }
  /* img {
    width: 16px;
    height: 16px;
    display: block;
    flex-shrink: 0;
    user-select: none;
  } */
  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    user-select: none;
    color: ${(props) => props.theme.color};
    fill: ${(props) => props.theme.color};
  }
`;

const ToolbarItemRender: FC<ToolbarItemType> = ({
  list,
  title,
  description,
  icon,
  onClick,
  component,
}) => {
  if (list && list.length > 0) {
    return (
      <>
        <IconTooltip content={title} description={description}>
          <DropDownMenu list={list}>
            {/* <img src={icon} alt={title} /> */}
            {icon && <div className="icon" dangerouslySetInnerHTML={{ __html: icon }}></div>}
          </DropDownMenu>
        </IconTooltip>
      </>
    );
  } else if (component) {
    return <>{component}</>;
  } else {
    return (
      <>
        <IconTooltip content={title} description={description} onClick={onClick}>
          {/* <img src={icon} alt={title} /> */}
          {icon && <div className="icon" dangerouslySetInnerHTML={{ __html: icon }}></div>}
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
