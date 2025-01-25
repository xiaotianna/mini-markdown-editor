import { ToolbarType } from "./toolbar";

export interface GlobalConfig {
  /**
   * 需要渲染的 toolbar，默认全部渲染
   * @type {ToolbarType[]} 需要渲染的 toolbar 数组
   * @type {Record<ToolbarType, boolean>} 需要渲染的 toolbar 对象，值为 true 时渲染，false 时不渲染
   */
  toolbar?: ToolbarType[] | Record<ToolbarType, boolean>;
  /**
   * 底部状态栏是否显示，默认显示
   * @type {boolean}
   */
  status?: boolean;
  /**
   * 编辑器主题
   * @type {"light" | "dark"}
   */
  theme?: "light" | "dark";
  /**
   * 代码块主题
   * @type {"default" | "atom" | "github"}
   */
  codeTheme?: "default" | "atom" | "github";
  /**
   * 是否开启本地存储
   * @type {boolean}
   */
  local?: boolean; // 是否开启本地存储
  /**
   * 改变编辑器内容时触发
   * @type {(value: string) => void}
   */
  onChange?: (value: string) => void;
  /**
   * 上传图片时触发
   * @type {(file: File, callback: Callback) => void}
   */
  onUpload?: (file: File, callback: Callback) => void;
}

export type Callback = (param: { url: string; alt?: string }) => void;
