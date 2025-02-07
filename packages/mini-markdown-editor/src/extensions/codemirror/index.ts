import { Extension } from "@codemirror/state";
import { EditorView } from "@uiw/react-codemirror";
import { history } from "@codemirror/commands";
import { createMarkdownExtension } from "./markdown";
import { createHotkeysExtension } from "./hotkeys";
import { createEventExtension } from "./event";

import type { EventOptions } from "./event.d";

interface ExtensionOptions extends EventOptions {
  // 是否开启快捷键支持
  name?: string;
}

export const createEditorExtensions = (options: ExtensionOptions): Extension[] => {
  const { scrollWrapper = "editor", eventExt, onDragUpload, onPasteUpload } = options;

  // 创建基础扩展数组
  const extensions: Extension[] = [
    createHotkeysExtension(),
    createMarkdownExtension(),
    createEventExtension({ scrollWrapper, eventExt, onDragUpload, onPasteUpload }),
    history(),
    EditorView.lineWrapping,
  ];

  return extensions;
};
