// 同步滚动（比例滚动）
const scrollSyncFn = () => {
  let isSyncing = false;
  return ({
    toScrollInstance, // 触发滚动的实例
    fromScrollInstance, // 同步滚动的实例
  }: {
    toScrollInstance: HTMLElement | null;
    fromScrollInstance: HTMLElement | null;
  }) => {
    if (isSyncing) return;
    isSyncing = true;
    if (toScrollInstance && fromScrollInstance) {
      const scrollTop = toScrollInstance.scrollTop;
      const scrollHeight = toScrollInstance.scrollHeight;
      const clientHeight = toScrollInstance.clientHeight || 1; // 可视区域高度
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight); // 滚动百分比
      fromScrollInstance!.scrollTop =
        scrollPercentage * (fromScrollInstance!.scrollHeight - fromScrollInstance!.clientHeight);
    }
    isSyncing = false;
  };
};

export const scrollSync = scrollSyncFn();
