import { create } from "zustand";

export interface ToolbarStoreType {
  isFullScreen: boolean;
  setIsFullScreen: (isFullScreen: boolean) => any;
}

const useToolbarStore = create<ToolbarStoreType>((set) => ({
  // 全屏
  isFullScreen: false,
  setIsFullScreen: (isFullScreen: boolean) => set({ isFullScreen }),
  // 只写
  // 仅预览
}));

export { useToolbarStore };
