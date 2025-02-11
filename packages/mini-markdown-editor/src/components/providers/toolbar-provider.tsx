import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { ToolbarContextValues, ToolbarItem } from "@/types/toolbar";
import { toolbarConfig as toolbarManager } from "@/config/toolbar";

export const ToolbarContext = createContext<ToolbarContextValues | undefined>(undefined);

interface ToolbarProviderProps {
  children: React.ReactNode;
  toolbarConfig?: {
    addTools?: ToolbarItem[];
    excludeTools?: string[];
  };
}

// 工具栏处理（针对是否有过滤工具）
const processToolbars = (
  defaultToolbars: ToolbarItem[],
  additionalTools: ToolbarItem[] = [],
  excludeTools?: string[],
): ToolbarItem[] => {
  if (excludeTools?.length) {
    return [
      ...defaultToolbars.filter((item) => !excludeTools.includes(item.type)),
      ...additionalTools,
    ];
  }
  return [...defaultToolbars, ...additionalTools];
};

export const ToolbarProvider = React.memo<ToolbarProviderProps>(({ children, toolbarConfig }) => {
  const [toolbars, setToolbars] = useState<ToolbarItem[]>(() => {
    // 初始化工具栏
    const defaultToolbars = toolbarManager.getDefaultToolbar();
    return processToolbars(defaultToolbars, toolbarConfig?.addTools, toolbarConfig?.excludeTools);
  });

  // 更新工具栏
  const updateToolbars = useCallback(() => {
    const defaultToolbars = toolbarManager.getDefaultToolbar();
    const newToolbars = processToolbars(
      defaultToolbars,
      toolbarConfig?.addTools,
      toolbarConfig?.excludeTools,
    );

    setToolbars(newToolbars);
    toolbarManager.updateToolbars(newToolbars);
  }, [toolbarConfig?.addTools, toolbarConfig?.excludeTools]);

  // 监听配置变化
  useEffect(() => {
    updateToolbars();
  }, [updateToolbars]);

  const value = useMemo(
    () => ({
      toolbars,
    }),
    [toolbars],
  );

  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
});
