import React, { createContext, useEffect, useMemo, useState } from "react";
import { ToolbarContextValues, ToolbarItem } from "@/types/toolbar";
import { toolbarConfig as toolbarManager } from "@/config/toolbar";

export const ToolbarContext = createContext<ToolbarContextValues | undefined>(undefined);

export const ToolbarProvider = React.memo<{
  children: React.ReactNode;
  toolbarConfig?: { addTools?: ToolbarItem[]; excludeTools?: string[] };
}>(({ children, toolbarConfig }) => {
  const [toolbars, setToolbars] = useState<ToolbarItem[]>([]);

  useEffect(() => {
    const defaultToolbars = toolbarManager.getDefaultToolbar();
    const additionalTools = toolbarConfig?.addTools || [];
    // 过滤设定的工具栏
    if (toolbarConfig?.excludeTools) {
      const excludeTools = toolbarConfig.excludeTools;
      setToolbars([
        ...defaultToolbars.filter((item) => !excludeTools.includes(item.type)),
        ...additionalTools,
      ]);
      return;
    }

    setToolbars([...defaultToolbars, ...additionalTools]);
    toolbarManager.updateToolbars([...defaultToolbars, ...additionalTools]);
  }, [toolbarConfig]);

  const values = useMemo(
    () => ({
      toolbars,
    }),
    [toolbars],
  );

  return <ToolbarContext.Provider value={values}>{children}</ToolbarContext.Provider>;
});
