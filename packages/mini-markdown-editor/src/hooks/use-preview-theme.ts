import { previewTheme } from "@/theme/preview-theme";
import { useEffect } from "react";

export const usePreviewTheme = (themeProps: "light" | "dark") => {
  useEffect(() => {
    const theme = themeProps === "light" ? previewTheme.light : previewTheme.dark;

    // 设置 CSS 变量
    const root = document.body;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--md-preview-${key}`, value);
    });
  }, [themeProps]);
};
