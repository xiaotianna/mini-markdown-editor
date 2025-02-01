import { FC, useMemo } from "react";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

const StatusWrapper = styled.div`
  width: 100%;
  height: 24px;
  /* color: #3f4a54; */
  color: ${(props) => props.theme.statusColor};
  /* border-top: 1px solid #e6e6e6; */
  border-top: 1px solid ${(props) => props.theme.borderColor};
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
  const content = useEditorContentStore((state) => state.content);

  const contentNum = useMemo(() => {
    return content.replace(/[\s\n]/g, "").length;
  }, [content]);

  // 状态改变处理函数
  const handleSyncScrollChange: CheckboxProps["onChange"] = (e) => {
    updateSyncScrollStatus(e.target.checked);
  };

  return (
    <StatusWrapper>
      <div className="status-left">字数: {contentNum}</div>
      <div className="status-right">
        <Checkbox className="checkbox" checked={isSyncScroll} onChange={handleSyncScrollChange}>
          <span className="checkbox-text">同步滚动</span>
        </Checkbox>
        <div className="scroll-top">滚动到顶部</div>
      </div>
    </StatusWrapper>
  );
};

export default Status;
