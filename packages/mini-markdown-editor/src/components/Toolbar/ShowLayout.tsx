import { FC } from "react";
import styled from "styled-components";
import IconTooltip from "../base/IconTooltip";
import WriteIcon from "@/assets/images/write.svg?raw";
import PreviewIcon from "@/assets/images/perview.svg?raw";
import ContentsIcon from "@/assets/images/contents.svg?raw";
import HelpIcon from "@/assets/images/help.svg?raw";
import { useToolbarStore } from "@/store/toolbar";
import SidebarContents from "@/components/Sidebar/Contents";
import SidebarHelp from "@/components/Sidebar/Help";

const Wrapper = styled.div<{ $isSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${(props) => (props.$isSelect ? "#0366d6" : "")};
`;

// 只写按钮
export const Write: FC = () => {
  const { isOnlyWrite, setIsOnlyWrite } = useToolbarStore();
  return (
    <>
      <IconTooltip content={"只写"} onClick={() => setIsOnlyWrite()}>
        <Wrapper $isSelect={isOnlyWrite} dangerouslySetInnerHTML={{ __html: WriteIcon }}></Wrapper>
      </IconTooltip>
    </>
  );
};

// 仅预览按钮
export const Read: FC = () => {
  const { isOnlyPreview, setIsOnlyPreview } = useToolbarStore();
  return (
    <>
      <IconTooltip content={"仅预览"} onClick={() => setIsOnlyPreview()}>
        <Wrapper
          $isSelect={isOnlyPreview}
          dangerouslySetInnerHTML={{ __html: PreviewIcon }}
        ></Wrapper>
      </IconTooltip>
    </>
  );
};

// 目录按钮
export const Contents: FC = () => {
  // 标记
  const ComponentsMark = "Contents";
  const { isSidebar, componentMark, setSidebar } = useToolbarStore();
  return (
    <>
      <IconTooltip content={"目录"} onClick={() => setSidebar(<SidebarContents />, ComponentsMark)}>
        <Wrapper
          $isSelect={isSidebar && componentMark === ComponentsMark}
          dangerouslySetInnerHTML={{ __html: ContentsIcon }}
        ></Wrapper>
      </IconTooltip>
    </>
  );
};

// 帮助按钮
export const Help: FC = () => {
  // 标记
  const ComponentsMark = "Help";
  const { isSidebar, componentMark, setSidebar } = useToolbarStore();
  return (
    <>
      <IconTooltip content={"帮助"} onClick={() => setSidebar(<SidebarHelp />, ComponentsMark)}>
        <Wrapper
          $isSelect={isSidebar && componentMark === ComponentsMark}
          dangerouslySetInnerHTML={{ __html: HelpIcon }}
        ></Wrapper>
      </IconTooltip>
    </>
  );
};
