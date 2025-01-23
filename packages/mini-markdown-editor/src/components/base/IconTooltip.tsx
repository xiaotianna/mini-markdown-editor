import React, { FC } from "react";
import { Tooltip } from "antd";

const IconTooltip: FC<{
  content: string | React.ReactNode;
  children: React.ReactNode;
}> = ({ content, children }) => {
  // TODO: COLOR!
  return (
    <Tooltip title={content} placement="top">
      <div>{children}</div>
    </Tooltip>
  );
};

export default React.memo(IconTooltip);
