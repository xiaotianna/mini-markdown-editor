import { FC } from "react";
import styled from "styled-components";
import { ToolbarItem } from "./ToolbarItem";
import { CopyCodeButton } from "./CopyCodeButton";
import { useSyncEditorView } from "@/hooks/use-sync-editorview";
import { toolbarConfig } from "@/config/toolbar";
import { t } from "@/locales";

const ToolbarContent = styled.div`
  width: 100%;
  height: 35px;
  /* border-bottom: 1px solid #e6e6e6; */
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  /* background-color: #e6e6e6; */
  background-color: ${(props) => props.theme.borderColor};
  display: inline-block;
  height: 16px;
  margin: 0 8px;
  position: relative;
  top: 0.1em;
  width: 1px;
`;

const Toolbar: FC = () => {
  const toolbars = toolbarConfig.getAllToolbars();
  useSyncEditorView();

  return (
    <ToolbarContent>
      <ToolbarLeft>
        {toolbars.map((item, index) =>
          item.type === "line" ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <ToolbarItem key={`item-${index}`} {...item} t={t} />
          ),
        )}
      </ToolbarLeft>
      <ToolbarRight>
        <CopyCodeButton />
      </ToolbarRight>
    </ToolbarContent>
  );
};

export default Toolbar;
