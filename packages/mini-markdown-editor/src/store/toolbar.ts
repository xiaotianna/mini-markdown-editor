import { create } from "zustand";

export interface ToolbarStoreType {
  isFullScreen: boolean;
  setIsFullScreen: (isFullScreen: boolean) => void;
  isOnlyWrite: boolean;
  setIsOnlyWrite: () => void;
  isOnlyPreview: boolean;
  setIsOnlyPreview: () => void;
  isSidebar: boolean;
  sidebarComponent: React.ReactNode | null;
}

const useToolbarStore = create<ToolbarStoreType>((set, get) => ({
  // 全屏
  isFullScreen: false,
  setIsFullScreen: (isFullScreen: boolean) => set({ isFullScreen }),
  // 只写
  isOnlyWrite: false,
  setIsOnlyWrite: () => {
    const { isOnlyWrite } = get();
    set({ isOnlyWrite: !isOnlyWrite, isOnlyPreview: false });
  },
  // 仅预览
  isOnlyPreview: false,
  setIsOnlyPreview: () => {
    const { isOnlyPreview } = get();
    set({ isOnlyPreview: !isOnlyPreview, isOnlyWrite: false });
  },
  // 侧边栏
  isSidebar: false,
  sidebarComponent: null,
}));

export { useToolbarStore };
