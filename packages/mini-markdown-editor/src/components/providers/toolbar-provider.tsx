import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { ToolbarContextValues, ToolbarItem } from "@/types/toolbar";
import { toolbarConfig as toolbarManager } from "@/config/toolbar";

export const ToolbarContext = createContext<ToolbarContextValues | undefined>(undefined);

interface ToolbarProviderProps {
  children: React.ReactNode;
  toolbarConfig?: {
    addTools?: ToolbarItem[];
    excludeTools?: string[];
    orderTools?: {
      type: string;
      order: number;
    }[];
  };
}

// 处理工具栏的函数（过滤、添加和排序）
const processToolbars = (
  defaultToolbars: ToolbarItem[],
  additionalTools: ToolbarItem[] = [],
  excludeTools?: string[],
  toolsOrder?: { type: string; order: number }[],
): ToolbarItem[] => {
  let processedToolbars = [...defaultToolbars];

  // 过滤工具
  if (excludeTools?.length) {
    processedToolbars = processedToolbars.filter((item) => !excludeTools.includes(item.type));
  }

  // 添加工具
  if (additionalTools.length) {
    processedToolbars = [...processedToolbars, ...additionalTools];
  }

  // 判断并处理工具顺序
  if (toolsOrder?.length) {
    const orderMap = new Map(toolsOrder.map((item) => [item.type, item.order]));
    processedToolbars = [...processedToolbars].sort((a, b) => {
      const orderA = orderMap.get(a.type) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.type) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }

  return processedToolbars;
};

export const ToolbarProvider = React.memo<ToolbarProviderProps>(({ children, toolbarConfig }) => {
  const [toolbars, setToolbars] = useState<ToolbarItem[]>(() => {
    const defaultToolbars = toolbarManager.getDefaultToolbar();
    return processToolbars(
      defaultToolbars,
      toolbarConfig?.addTools,
      toolbarConfig?.excludeTools,
      toolbarConfig?.orderTools,
    );
  });

  const updateToolbars = useCallback(() => {
    const defaultToolbars = toolbarManager.getDefaultToolbar();
    const newToolbars = processToolbars(
      defaultToolbars,
      toolbarConfig?.addTools,
      toolbarConfig?.excludeTools,
      toolbarConfig?.orderTools,
    );

    setToolbars(newToolbars);
    toolbarManager.updateToolbars(newToolbars);
  }, [toolbarConfig?.addTools, toolbarConfig?.excludeTools, toolbarConfig?.orderTools]);

  // 更新工具栏
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
