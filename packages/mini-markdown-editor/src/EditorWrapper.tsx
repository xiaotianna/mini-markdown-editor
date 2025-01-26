import { FC, useDeferredValue } from "react";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import Status from "@/components/Status";
import { Row, Col } from "antd";
import { ToolbarProvider } from "@/components/providers/toolbar-provider";
import { ConfigProvider } from "@/components/providers/config-provider";
import { GlobalConfig } from "./types/global-config";
import { useToolbarStore } from "./store/toolbar";

const Container = styled.div`
  width: 100%;
  min-width: 700px;
  max-width: 1200px;
  min-height: 500px;
  height: 100%;
  border: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  &.md-editor-fullscreen {
    position: fixed !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10000 !important;
    width: auto !important;
    max-width: none !important;
    height: auto !important;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const StyledRow = styled(Row)`
  height: 100%;
  .ant-col {
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }
  }
`;

const Divider = styled.div`
  background-color: #e6e6e6;
  display: inline-block;
  height: 100%;
  width: 1px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const EditorWrapper: FC<GlobalConfig> = (config) => {
  const content = useEditorContentStore((state) => state.content);
  const deferredContent = useDeferredValue(content);
  const isFullScreen = useToolbarStore((state) => state.isFullScreen);

  return (
    <Container className={`md-editor ${isFullScreen && "md-editor-fullscreen"}`}>
      <ConfigProvider config={config}>
        <ToolbarProvider>
          {/* 工具栏 */}
          <Toolbar />
        </ToolbarProvider>
        {/* 内容区域 */}
        <ContentWrapper>
          <StyledRow>
            <Col span={12}>
              {/* 编辑区 */}
              <Editor />
            </Col>
            <Col span={12}>
              {/* 渲染区 */}
              <Preview content={deferredContent} />
            </Col>
            <Col span={10}>
              {/* 渲染区 */}
              123
            </Col>
          </StyledRow>
          {/* 分割线 */}
          <Divider />
        </ContentWrapper>
        {/* 底部状态栏 */}
        {config.status ? <Status /> : null}
      </ConfigProvider>
    </Container>
  );
};

export default EditorWrapper;
