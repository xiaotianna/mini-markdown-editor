import { ToolbarType } from "./toolbar";

export interface GlobalConfig {
  /**
   * 需要渲染的 toolbar，默认全部渲染
   * @type {ToolbarType[]} 需要渲染的 toolbar 数组
   * @type {Record<ToolbarType, boolean>} 需要渲染的 toolbar 对象，值为 true 时渲染，false 时不渲染
   */
  toolbar?: ToolbarType[] | Record<ToolbarType, boolean>;
  status?: {
    hidden: boolean; // 是否隐藏
    scrollSync: boolean; // 是否同步滚动
  };
  theme?: "light" | "dark"; // 主题
  codeTheme: "default" | "atom" | "github"; // 代码主题
  showCodeRowNumber: boolean; // 是否显示编辑区行号
  preview: boolean; // 是否显示预览区
  local: boolean; // 是否开启本地存储
}
