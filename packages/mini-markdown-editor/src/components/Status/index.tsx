import { FC, useMemo } from "react";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import { handleScrollTop } from "@/utils/handle-scroll";
import { t, TRANSLATION_KEYS } from "@/locales";
import { TOOLBAR_KEYS } from "@/locales/keys";

const StatusWrapper = styled.div`
  width: 100%;
  height: 24px;
  /* color: #3f4a54; */
  color: ${(props) => props.theme.statusColor};
  /* border-top: 1px solid #e6e6e6; */
  border-top: 1px solid ${(props) => props.theme.borderColor};
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  height: 24px;
  justify-content: space-between;
  padding: 0 10px;
  .status {
    &-left {
      height: 100%;
      display: flex;
      align-items: center;
    }
    &-right {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      .checkbox-text {
        font-size: 12px;
        color: ${(props) => props.theme.statusColor};
      }
      .scroll-top {
        cursor: pointer;
      }
    }
  }
`;

const Status: FC<{ isSyncScroll: boolean; updateSyncScrollStatus: (val: boolean) => void }> = ({
  isSyncScroll,
  updateSyncScrollStatus,
}) => {
  const { content, editorView, previewView } = useEditorContentStore();

  const contentNum = useMemo(() => {
    return content.replace(/[\s\n]/g, "").length;
  }, [content]);

  // 同步滚动状态改变处理函数
  const handleSyncScrollChange: CheckboxProps["onChange"] = (e) => {
    updateSyncScrollStatus(e.target.checked);
  };

  // 滚动到顶部
  const handleAreaScrollTop = () => {
    if (editorView && previewView) {
      handleScrollTop({ editorView, previewView });
    }
    // TODO: 处理同步滚动后的操作
  };

  return (
    <StatusWrapper>
      <div className="status-left">
        {t(TOOLBAR_KEYS.STATUS.WORDS as TRANSLATION_KEYS)}: {contentNum}
      </div>
      <div className="status-right">
        <Checkbox
          className="checkbox"
          name="sync-scroll"
          checked={isSyncScroll}
          onChange={handleSyncScrollChange}
        >
          <span className="checkbox-text">
            {t(TOOLBAR_KEYS.STATUS.SYNC_SCROLL as TRANSLATION_KEYS)}
          </span>
        </Checkbox>
        <div className="scroll-top" onClick={handleAreaScrollTop}>
          {t(TOOLBAR_KEYS.STATUS.SCROLL_TOP as TRANSLATION_KEYS)}
        </div>
      </div>
    </StatusWrapper>
  );
};

export default Status;
