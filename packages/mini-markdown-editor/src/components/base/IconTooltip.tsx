import React, { FC } from "react";
import { Tooltip } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";

const IconTooltip: FC<{
  content: string | React.ReactNode;
  description?: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ content, description, children, placement = "top", onClick }) => {
  const title = (
    <div
      style={{
        textAlign: "center",
        whiteSpace: "pre-line",
      }}
    >
      <div>{content}</div>
      <div>{description}</div>
    </div>
  );
  return (
    <Tooltip title={title} placement={placement}>
      <div onClick={onClick}>{children}</div>
    </Tooltip>
  );
};

export default React.memo(IconTooltip);
