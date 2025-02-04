import { Extension } from "@codemirror/state";
import { EditorView, ViewPlugin } from "@uiw/react-codemirror";
import { history } from "@codemirror/commands";
import { createMarkdownExtension } from "./markdown";
import { createHotkeysExtension } from "./hotkeys";
import { createEventExtension } from "./event";

interface ExtensionOptions {
  scrollWrapper?: string;
  eventExt?: ViewPlugin<{
    dom?: HTMLElement;
    view: EditorView;
    destroy(): void;
  }>;
}

export const createEditorExtensions = (options: ExtensionOptions = {}): Extension[] => {
  const { scrollWrapper = "editor", eventExt } = options;

  return [
    createHotkeysExtension(),
    createMarkdownExtension(),
    createEventExtension({ scrollWrapper, eventExt }),
    history(),
    //? 自动换行，可以考虑添加配置项
    EditorView.lineWrapping,
  ];
};
