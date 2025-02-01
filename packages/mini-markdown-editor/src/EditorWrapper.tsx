import { FC, Fragment, useDeferredValue } from "react";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import Status from "@/components/Status";
import { Row, Col, ConfigProvider as AntdConfigProvider, theme as AntdTheme } from "antd";
import { ToolbarProvider } from "@/components/providers/toolbar-provider";
import { ConfigProvider } from "@/components/providers/config-provider";
import { HotkeysProvider } from "@/components/providers/hotkeys-provider";
import { GlobalConfig } from "./types/global-config";
import { useToolbarStore } from "./store/toolbar";
import { useInitSyncScrollStatus } from "./hooks/use-init-sync-scroll-status";
import GlobalTheme from "./theme/global-theme";

const Container = styled.div`
  width: 100%;
  min-width: 700px;
  max-width: 1200px;
  min-height: 500px;
  height: 100%;
  /* border: 1px solid #e6e6e6; */
  border: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  flex-direction: column;
  /* background-color: #fff; */
  background-color: ${(props) => props.theme.background};
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .ant-col {
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar-thumb {
      /* background-color: #d9d9d9; */
      background-color: ${(props) => props.theme.scrollbarThumbBgColor};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      /* background-color: #f5f5f5; */
      background-color: ${(props) => props.theme.scrollbarTrackBgColor};
    }
  }
`;

const Divider = styled.div`
  /* background-color: #e6e6e6; */
  background-color: ${(props) => props.theme.borderColor};
  display: inline-block;
  height: 100%;
  width: 1px;
  position: absolute;
  top: 50%;
  z-index: 1;
`;

// 布局配置映射
const LayoutConfig = {
  // 只写模式
  WRITE_ONLY: { cols: [18, 0, 0], components: ["editor", "preview", "sidebar"] },
  // 仅预览模式
  READ_ONLY: { cols: [0, 18, 0], components: ["editor", "preview", "sidebar"] },
  // 读写模式
  READ_WRITE: { cols: [12, 12, 0], components: ["editor", "preview", "sidebar"] },
  // 只写+侧边栏
  WRITE_ONLY_SIDEBAR: { cols: [18, 0, 6], components: ["editor", "preview", "sidebar"] },
  // 仅预览+侧边栏
  READ_ONLY_SIDEBAR: { cols: [0, 18, 6], components: ["editor", "preview", "sidebar"] },
  // 读写+侧边栏
  READ_WRITE_SIDEBAR: { cols: [9, 9, 6], components: ["editor", "preview", "sidebar"] },
};

// 渲染不同分区
const RenderRow: FC<{
  editor: React.ReactNode;
  preview: React.ReactNode;
}> = ({ editor, preview }) => {
  const { isOnlyWrite, isOnlyPreview, isSidebar, sidebarComponent } = useToolbarStore();

  // 根据状态确定布局配置
  const getLayoutConfig = () => {
    // 处理只写模式
    if (isOnlyWrite && !isOnlyPreview) {
      return isSidebar ? LayoutConfig.WRITE_ONLY_SIDEBAR : LayoutConfig.WRITE_ONLY;
    }
    // 处理只读模式
    if (!isOnlyWrite && isOnlyPreview) {
      return isSidebar ? LayoutConfig.READ_ONLY_SIDEBAR : LayoutConfig.READ_ONLY;
    }
    // 处理读写模式（默认模式）
    if (!isOnlyWrite && !isOnlyPreview) {
      return isSidebar ? LayoutConfig.READ_WRITE_SIDEBAR : LayoutConfig.READ_WRITE;
    }
    // 处理异常情况（都为true的情况），默认返回只写模式
    return isSidebar ? LayoutConfig.WRITE_ONLY_SIDEBAR : LayoutConfig.WRITE_ONLY;
  };

  const layout = getLayoutConfig();
  const components = {
    editor,
    preview,
    sidebar: sidebarComponent,
  };
  // 两列以上时显示分割线
  const showDivider = layout.cols.length > 1;

  return (
    <>
      {layout.cols.map((span, index) => {
        const offset =
          (layout.cols.slice(0, index + 1).reduce((acc, curr) => acc + curr, 0) /
            layout.cols.reduce((acc, curr) => acc + curr, 0)) *
          100;
        return (
          <Fragment key={`col-${index}`}>
            <Col span={span}>{components[layout.components[index] as keyof typeof components]}</Col>
            {showDivider && offset !== 100 && (
              <Divider style={{ left: `${offset}%`, transform: `translate(-${offset}%, -50%)` }} />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

const EditorWrapper: FC<GlobalConfig> = (config) => {
  const content = useEditorContentStore((state) => state.content);
  const deferredContent = useDeferredValue(content);
  const isFullScreen = useToolbarStore((state) => state.isFullScreen);
  const { isSyncScroll, updateSyncScrollStatus } = useInitSyncScrollStatus();

  return (
    <GlobalTheme theme={config.theme}>
      <Container className={`md-editor ${isFullScreen && "md-editor-fullscreen"}`}>
        <ConfigProvider config={config}>
          {/* antd 主题样式 */}
          <AntdConfigProvider
            theme={{ algorithm: config.theme === "light" ? undefined : AntdTheme.darkAlgorithm }}
          >
            <HotkeysProvider>
              <ToolbarProvider>
                {/* 工具栏 */}
                <Toolbar />
              </ToolbarProvider>
              {/* 内容区域 */}
              <ContentWrapper>
                <StyledRow>
                  <RenderRow
                    editor={<Editor isSyncScroll={isSyncScroll} />}
                    preview={<Preview content={deferredContent} isSyncScroll={isSyncScroll} />}
                  />
                </StyledRow>
              </ContentWrapper>
            </HotkeysProvider>
            {/* 底部状态栏 */}
            {config.status ? (
              <Status isSyncScroll={isSyncScroll} updateSyncScrollStatus={updateSyncScrollStatus} />
            ) : null}
          </AntdConfigProvider>
        </ConfigProvider>
      </Container>
    </GlobalTheme>
  );
};

export default EditorWrapper;
