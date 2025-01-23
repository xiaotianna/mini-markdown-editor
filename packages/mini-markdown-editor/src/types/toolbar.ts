export interface ToolbarItem {
  type: ToolbarType;
  icon?: string;
  title?: string;
  list?: string[];
  disabled?: boolean;
  visible?: boolean;
  onClick?: () => void;
}

export interface ToolbarContextValues {
  toolbars: ToolbarItem[];
  addToolbar?: (toolbarItem: ToolbarItem) => void;
  removeToolbar?: (type: ToolbarType) => void;
  updateToolbar?: (type: ToolbarType, newConfig: ToolbarItem) => void;
  reorderToolbars?: (newOrder: ToolbarType[]) => void;
}

export type ToolbarType =
  | "heading"
  | "bold"
  | "italic"
  | "underline"
  | "delete"
  | "line"
  | "blockquote"
  | "ul"
  | "ol"
  | "inlinecode"
  | "code"
  | "link"
  | "image"
  | "table"
  | "undo"
  | "redo"
  | "fullscreen"
  | "write"
  | "preview"
  | "contents"
  | "html"
  | "pdf";
