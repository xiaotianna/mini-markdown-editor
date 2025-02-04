export interface ToolbarItem {
  type: ToolbarType;
  icon?: string;
  title?: string;
  description?: string;
  list?: ToolbarItemListItem[];
  disabled?: boolean;
  visible?: boolean;
  onClick?: () => void;
  component?: React.ReactNode;
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
  | "heading"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
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
  | "output"
  | "emoji";
