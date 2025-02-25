/**
 * 该文件用作打包时的入口文件
 */
import Editor from "./EditorWrapper";
// 导出组件
export { Editor };

// 导出配置
export { toolbarConfig as ToolbarManager } from "@/config/toolbar";
export { insertContent } from "@/utils/insert-content";

// 导出常量
export { EDITOR_CONTENT_KEY, SYNC_SCROLL_STATUS } from "@/common/index";

// 导出 ts 类型
export * from "@/types/code-mirror";
export * from "@/types/global-config";
export * from "@/types/toolbar";
export * from "@/types/ref";
