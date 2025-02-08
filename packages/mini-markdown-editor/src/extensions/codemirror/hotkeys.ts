import { Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { handleHotkeys } from "@/utils/handle-hotkeys";

export function createHotkeysExtension(): Extension {
  return keymap.of([
    ...Object.entries(handleHotkeys()).map(([key, value]) => ({
      key,
      ...value,
    })),

    //! 留空 暴露外部其他内部快捷键
  ]);
}
