import styled from "styled-components";
import { DropDownMenu } from "../base/DropDownMenu";
import IconTooltip from "../base/IconTooltip";
import { FC } from "react";

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
    width: 100%;
    height: 100%;
  }
`;

// 新增的ToolbarItem组件
export const ToolbarItem: FC<{
  icon: string | undefined;
  title: string | undefined;
  list?: Array<string>;
}> = ({ icon, title, list }) => (
  <ToolbarItemWrapper className="item">
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
