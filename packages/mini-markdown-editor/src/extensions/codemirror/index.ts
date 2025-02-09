import { Extension } from "@codemirror/state";
import { EditorView } from "@uiw/react-codemirror";
import { history } from "@codemirror/commands";
import { createMarkdownExtension } from "./markdown";
import { createHotkeysExtension } from "./hotkeys";
import { createEventExtension } from "./event";
import type { EventOptions } from "./event.d";
import { ToolbarItem } from "@/types/toolbar";

interface ExtensionOptions extends EventOptions {
  enableShortcuts?: boolean;
  toolbars?: ToolbarItem[];
}

export const createEditorExtensions = (options: ExtensionOptions): Extension[] => {
  const {
    scrollWrapper = "editor",
    eventExt,
    enableShortcuts,
    onDragUpload,
    onPasteUpload,
  } = options;

  // 创建基础扩展数组
  const extensions: Extension[] = [
    createMarkdownExtension(),
    createEventExtension({ scrollWrapper, eventExt, onDragUpload, onPasteUpload }),
    history(),
    EditorView.lineWrapping,
  ];

  // 是否开启快捷键支持
  if (enableShortcuts) {
    extensions.push(createHotkeysExtension(options.toolbars!));
  }

  return extensions;
};
