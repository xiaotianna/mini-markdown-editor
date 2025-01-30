import { SYNC_SCROLL_STATUS } from "@/common";
import { safeLocalStorage } from "@/utils/storage";
import { useEffect, useState } from "react";

export const useInitSyncScrollStatus = () => {
  const localStorage = safeLocalStorage();
  const [isSyncScroll, setIsSyncScroll] = useState(() => {
    const status = localStorage.getItem(SYNC_SCROLL_STATUS);
    return status === null ? true : status !== "false";
  });

  // 初始化同步滚动状态
  const initSyncScrollStatus = () => {
    const status = localStorage.getItem(SYNC_SCROLL_STATUS);
    if (status === null) {
      localStorage.setItem(SYNC_SCROLL_STATUS, "true");
    }
  };

  const updateSyncScrollStatus = (status: boolean) => {
    localStorage.setItem(SYNC_SCROLL_STATUS, String(status));
    //! 更新状态
    setIsSyncScroll(status);
  };

  // 初始化同步滚动状态
  useEffect(() => {
    initSyncScrollStatus();
  }, []);

  return { isSyncScroll, updateSyncScrollStatus };
};
