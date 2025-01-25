import { GlobalConfig } from "@/types/global-config";

// 全局配置
export const globalConfig: GlobalConfig = {
  toolbar: [], // 需要渲染的 toolbar
  status: {
    hidden: false, // 是否隐藏
    scrollSync: true, // 是否同步滚动
  },
  theme: "light", // 主题
  codeTheme: "default", // 代码主题
  showCodeRowNumber: false, // 是否显示编辑区行号
  preview: true, // 是否显示预览区
  local: false, // 是否开启本地存储
};

// 默认配置
export const defaultConfig = {
  ...globalConfig,
  // ...
};
