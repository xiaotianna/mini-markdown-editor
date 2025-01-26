export interface ToolbarItem {
  type: ToolbarType;
  icon?: string;
  title?: string;
  list?: ToolbarItemListItem[];
  disabled?: boolean;
  visible?: boolean;
  onClick?: () => void;
}

export interface ToolbarItemListItem {
  title: string;
  type: string;
  onClick?: (...args: any[]) => void | (() => void);
}

export interface ToolbarContextValues {
  toolbars: ToolbarItem[];
  addToolbar?: (toolbarItem: ToolbarItem) => void;
  removeToolbar?: (type: ToolbarType) => void;
  updateToolbar?: (type: ToolbarType, newConfig: ToolbarItem) => void;
  reorderToolbars?: (newOrder: ToolbarType[]) => void;
}

export type ToolbarType =
  | "title"
  | "first-title"
  | "second-title"
  | "third-title"
  | "fourth-title"
  | "fifth-title"
  | "sixth-title"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  // TODO: 后续要规范化line无效type的写法
  | "line"
  | "blockquote"
  | "ul"
  | "ol"
  | "inlinecode"
  | "code"
  | "link"
  | "image"
  | "image-link"
  | "image-upload"
  | "table"
  | "undo"
  | "redo"
  | "fullscreen"
  | "write"
  | "preview"
  | "contents"
  | "help"
  | "html"
  | "pdf";
