import React, { createContext, useEffect, useMemo, useState } from "react";
import { ToolbarContextValues, ToolbarItem } from "@/types/toolbar";
import { toolbarConfig } from "@/config/toolbar";

export const ToolbarContext = createContext<ToolbarContextValues | undefined>(undefined);

export const ToolbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toolbars, setToolbars] = useState<ToolbarItem[]>([]);

  useEffect(() => {
    setToolbars(toolbarConfig.getAllToolbars());
  }, []);

  const values = useMemo(
    () => ({
      toolbars,
    }),
    [toolbars],
  );

  return <ToolbarContext.Provider value={values}>{children}</ToolbarContext.Provider>;
};
