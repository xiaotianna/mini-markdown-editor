import { GlobalContextConfig } from "@/types/global-config";

// 默认配置
export const defaultGlobalConfig: GlobalContextConfig = {
  status: true, // 底部状态栏
  theme: "light", // 主题
  local: true, // 是否开启本地存储
  lineNumbers: false, // 是否显示行号
  enableShortcuts: true, // 是否开启快捷键
  onSave: () => {}, // 保存触发
  onChange: () => {}, // 内容改变触发
  onUpload: () => {}, // 上传图片触发
  onDragUpload: () => {}, // 拖拽上传图片触发
  onPatseUpload: () => {}, // 粘贴上传图片触发
};
