import { Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { Hotkey } from "@/common/hotkeys";
import { InsertTextEvent } from "@/config/toolbar/event";
import { ToolbarType } from "@/types/toolbar";

// 定义默认快捷键支持
const KEYMAP = {
  // Text
  [Hotkey.TITLE.FIRST.codeMirrorCommand]: {
    run: () => {
      Hotkey.TITLE.FIRST.handle?.();
      InsertTextEvent(Hotkey.TITLE.FIRST.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.TITLE.SECOND.codeMirrorCommand]: {
    run: () => {
      Hotkey.TITLE.SECOND.handle?.();
      InsertTextEvent(Hotkey.TITLE.SECOND.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.TITLE.THIRD.codeMirrorCommand]: {
    run: () => {
      Hotkey.TITLE.THIRD.handle?.();
      InsertTextEvent(Hotkey.TITLE.THIRD.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.TITLE.FOURTH.codeMirrorCommand]: {
    run: () => {
      Hotkey.TITLE.FOURTH.handle?.();
      InsertTextEvent(Hotkey.TITLE.FOURTH.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.TITLE.FIFTH.codeMirrorCommand]: {
    run: () => {
      Hotkey.TITLE.FIFTH.handle?.();
      InsertTextEvent(Hotkey.TITLE.FIFTH.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.TITLE.SIXTH.codeMirrorCommand]: {
    run: () => {
      Hotkey.TITLE.SIXTH.handle?.();
      InsertTextEvent(Hotkey.TITLE.SIXTH.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.BOLD.codeMirrorCommand]: {
    run: () => {
      Hotkey.BOLD.handle?.();
      InsertTextEvent(Hotkey.BOLD.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.ITALIC.codeMirrorCommand]: {
    run: () => {
      Hotkey.ITALIC.handle?.();
      InsertTextEvent(Hotkey.ITALIC.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.UNDERLINE.codeMirrorCommand]: {
    run: () => {
      Hotkey.UNDERLINE.handle?.();
      InsertTextEvent(Hotkey.UNDERLINE.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.DELETE.codeMirrorCommand]: {
    run: () => {
      Hotkey.DELETE.handle?.();
      InsertTextEvent(Hotkey.DELETE.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.BLOCKQUOTE.codeMirrorCommand]: {
    run: () => {
      Hotkey.BLOCKQUOTE.handle?.();
      InsertTextEvent(Hotkey.BLOCKQUOTE.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.UNORDERED_LIST.codeMirrorCommand]: {
    run: () => {
      Hotkey.UNORDERED_LIST.handle?.();
      InsertTextEvent(Hotkey.UNORDERED_LIST.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.ORDERED_LIST.codeMirrorCommand]: {
    run: () => {
      Hotkey.ORDERED_LIST.handle?.();
      InsertTextEvent(Hotkey.ORDERED_LIST.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.INLINE_CODE.codeMirrorCommand]: {
    run: () => {
      Hotkey.INLINE_CODE.handle?.();
      InsertTextEvent(Hotkey.INLINE_CODE.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.CODE_BLOCK.codeMirrorCommand]: {
    run: () => {
      Hotkey.CODE_BLOCK.handle?.();
      InsertTextEvent(Hotkey.CODE_BLOCK.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.LINK.codeMirrorCommand]: {
    run: () => {
      Hotkey.LINK.handle?.();
      InsertTextEvent(Hotkey.LINK.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.TABLE.codeMirrorCommand]: {
    run: () => {
      Hotkey.TABLE.handle?.();
      InsertTextEvent(Hotkey.TABLE.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },

  // Actions
  [Hotkey.FULL_SCREEN.codeMirrorCommand]: {
    run: () => {
      Hotkey.FULL_SCREEN.handle?.();
      InsertTextEvent(Hotkey.FULL_SCREEN.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
  [Hotkey.SAVE.codeMirrorCommand]: {
    run: () => {
      Hotkey.SAVE.handle?.();
      InsertTextEvent(Hotkey.SAVE.description as ToolbarType);
      return true;
    },
    preventDefault: true,
  },
};

export function createHotkeysExtension(): Extension {
  return keymap.of([
    ...Object.entries(KEYMAP).map(([key, value]) => ({
      key,
      ...value,
    })),

    //! 留空 暴露外部其他内部快捷键
  ]);
}
