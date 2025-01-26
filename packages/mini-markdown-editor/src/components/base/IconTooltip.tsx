import React, { FC } from "react";
import { Tooltip } from "antd";

const IconTooltip: FC<{
  content: string | React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ content, children, onClick }) => {
  return (
    <Tooltip title={content} placement="top">
      <div onClick={onClick}>{children}</div>
    </Tooltip>
  );
};

export default React.memo(IconTooltip);
