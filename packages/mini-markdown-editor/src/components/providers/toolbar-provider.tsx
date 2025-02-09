import React, { createContext, useEffect, useMemo, useState } from "react";
import { ToolbarContextValues, ToolbarItem } from "@/types/toolbar";
import { toolbarConfig as toolbarManager } from "@/config/toolbar";
import { toolbarSetupType } from "@/types/global-config";

export const ToolbarContext = createContext<ToolbarContextValues | undefined>(undefined);

export const ToolbarProvider: React.FC<{
  children: React.ReactNode;
  toolbarConfig?: toolbarSetupType;
}> = ({ children, toolbarConfig }) => {
  const [toolbars, setToolbars] = useState<ToolbarItem[]>([]);

  useEffect(() => {
    const defaultToolbars = toolbarManager.getDefaultToolbars();
    const additionalTools = toolbarConfig?.addTools || [];
    // 过滤掉type为toolbarConfig.excludeTools的工具
    if (toolbarConfig?.excludeTools) {
      const excludeTools = toolbarConfig.excludeTools;
      setToolbars([
        ...defaultToolbars.filter((item) => !excludeTools.includes(item.type)),
        ...additionalTools,
      ]);
      return;
    }

    setToolbars([...defaultToolbars, ...additionalTools]);
  }, [toolbarConfig]);

  const values = useMemo(
    () => ({
      toolbars,
    }),
    [toolbars],
  );

  return <ToolbarContext.Provider value={values}>{children}</ToolbarContext.Provider>;
};
