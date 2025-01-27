import { FC } from "react";
import styled from "styled-components";
import IconTooltip from "../base/IconTooltip";
import WriteIcon from "@/assets/images/write.svg?raw";
import PreviewIcon from "@/assets/images/perview.svg?raw";
import { useToolbarStore } from "@/store/toolbar";

const Wrapper = styled.div<{ $isSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${(props) => (props.$isSelect ? "#0366d6" : "")};
`;

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
