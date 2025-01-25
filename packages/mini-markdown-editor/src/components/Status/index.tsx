import { FC, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import { SYNC_SCROLL_STATUS } from "@/common";
import { safeLocalStorage } from "@/utils/storage";

const StatusWrapper = styled.div`
  width: 100%;
  height: 24px;
  color: #3f4a54;
  border-top: 1px solid #e6e6e6;
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
      }
      .scroll-top {
        cursor: pointer;
      }
    }
  }
`;

const Status: FC = () => {
  const { content } = useEditorContentStore();
  const localStorage = safeLocalStorage();
  const [syncScroll, setSyncScroll] = useState<boolean>();

  const contentNum = useMemo(() => {
    return content.replace(/[\s\n]/g, "").length;
  }, [content]);

  // 初始化时从 localStorage 读取状态
  useEffect(() => {
    const savedStatus = localStorage.getItem(SYNC_SCROLL_STATUS);
    //! 明确转换为布尔值
    const initialStatus = savedStatus === null ? true : savedStatus === "true";
    setSyncScroll(initialStatus);
  }, [localStorage]);

  // 状态改变处理函数
  const handleSyncScrollChange: CheckboxProps["onChange"] = (e) => {
    setSyncScroll(e.target.checked);
    localStorage.setItem(SYNC_SCROLL_STATUS, String(e.target.checked));
  };

  return (
    <StatusWrapper>
      <div className="status-left">字数: {contentNum}</div>
      <div className="status-right">
        <Checkbox className="checkbox" checked={syncScroll} onChange={handleSyncScrollChange}>
          <span className="checkbox-text">同步滚动</span>
        </Checkbox>
        <div className="scroll-top">滚动到顶部</div>
      </div>
    </StatusWrapper>
  );
};

export default Status;
