import { FC } from "react";
import styled from "styled-components";
import { useToolbar } from "@/hooks/use-toolbar";
import { ToolbarItem } from "./ToolbarItem";

const ToolbarContent = styled.div`
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #e6e6e6;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  background-color: #e6e6e6;
  display: inline-block;
  height: 16px;
  margin: 0 8px;
  position: relative;
  top: 0.1em;
  width: 1px;
`;

const Toolbar: FC = () => {
  const { toolbars } = useToolbar();

  return (
    <ToolbarContent>
      {toolbars.map((item, index) =>
        item.type === "line" ? (
          <Divider key={`divider-${index}`} />
        ) : (
          <ToolbarItem key={`item-${index}`} icon={item.icon} title={item.title} list={item.list} />
        ),
      )}
    </ToolbarContent>
  );
};

export default Toolbar;
