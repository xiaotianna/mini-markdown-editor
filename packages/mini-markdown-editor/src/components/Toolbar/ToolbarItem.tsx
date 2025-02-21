import styled from "styled-components";
import { DropDownMenu } from "../base/DropDownMenu";
import IconTooltip from "../base/IconTooltip";
import { FC, memo } from "react";
import type { ToolbarItem as ToolbarItemType } from "@/types/toolbar";
import type { t, TRANSLATION_KEYS } from "@/locales";
import { CLASS_PREFIX } from "@/common";

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

const ToolbarItemRender: FC<ToolbarItemType & t> = ({
  list,
  title,
  description,
  icon,
  onClick,
  component,
  t,
}) => {
  if (list && list.length > 0) {
    return (
      <>
        <DropDownMenu list={list} t={t}>
          {/* <img src={icon} alt={title} /> */}
          {icon && <div className="icon" dangerouslySetInnerHTML={{ __html: icon }}></div>}
        </DropDownMenu>
      </>
    );
  } else if (component) {
    return <>{component}</>;
  } else {
    return (
      <>
        <IconTooltip
          content={t?.(title as TRANSLATION_KEYS) || title}
          description={description}
          onClick={onClick}
        >
          {/* <img src={icon} alt={title} /> */}
          {icon && <div className="icon" dangerouslySetInnerHTML={{ __html: icon }}></div>}
        </IconTooltip>
      </>
    );
  }
};

export const ToolbarItem: FC<ToolbarItemType & t> = memo((props) => {
  return (
    <ToolbarItemWrapper
      className={`${CLASS_PREFIX}-toolbar-item ${CLASS_PREFIX}-toolbar-item-${props.type}`}
    >
      <ToolbarItemRender {...props} />
    </ToolbarItemWrapper>
  );
});
