import { EditorView, ReactCodeMirrorProps, ViewUpdate } from "@uiw/react-codemirror";
import { ToolbarItem } from "./toolbar";

export interface GlobalConfig extends ReactCodeMirrorProps {
  /**
   * 编辑器内容
   * @type {string}
   */
  initialValue?: string;
  /**
   * 配置工具栏
   * @type {{ addTools?: ToolbarItem[]; excludeTools?: string[] }}
   * 添加工具; 排除工具
   */
  toolbars?: { addTools?: ToolbarItem[]; excludeTools?: string[] };
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
   * 是否开启本地存储
   * @type {boolean}
   */
  local?: boolean; // 是否开启本地存储
  /**
   * 编辑区是否显示行号
   * @type {boolean}
   */
  lineNumbers?: boolean;
  /**
   * 是否开启快捷键支持
   * @type {boolean}
   */
  enableShortcuts?: boolean;
  /**
   * 改变编辑器内容时触发
   * @type {(value: string, editorView: ViewUpdate) => void}
   */
  onChange?: (value: string, editorView: ViewUpdate) => void;
  /**
   * 上传图片时触发
   * @type {(file: File, callback: Callback) => void}
   */
  onUpload?: (file: File, callback: Callback) => void;
  /**
   * 拖拽上传图片时触发
   * @type {(file: File, callback: Callback) => void}
   */
  onDragUpload?: (file: File, callback: Callback) => void;
  /**
   * 粘贴上传图片时触发
   * @type {(file: File, callback: Callback) => void}
   */
  onPatseUpload?: (file: File, callback: Callback) => void;
  /**
   * 保存触发
   * @type {(value: string, editorView: EditorView) => void}
   */
  onSave?: (value: string, editorView: EditorView) => void;
}

export type Callback = (param: { url: string; alt?: string }) => void;

export type GlobalContextConfig = Pick<
  GlobalConfig,
  | "theme"
  | "initialValue"
  | "toolbars"
  | "status"
  | "local"
  | "lineNumbers"
  | "enableShortcuts"
  | "onUpload"
  | "onDragUpload"
  | "onPatseUpload"
  | "onSave"
  | "onChange"
>;
export type EditorConfig = Omit<GlobalConfig, keyof GlobalContextConfig>;
