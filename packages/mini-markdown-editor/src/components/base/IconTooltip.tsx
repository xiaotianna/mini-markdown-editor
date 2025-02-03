import React, { FC } from "react";
import { Tooltip } from "antd";

const IconTooltip: FC<{
  content: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ content, description, children, onClick }) => {
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
    <Tooltip title={title} placement="top">
      <div onClick={onClick}>{children}</div>
    </Tooltip>
  );
};

export default React.memo(IconTooltip);
