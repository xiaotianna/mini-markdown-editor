import { Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { handleHotkeys } from "@/utils/handle-hotkeys";
import { toolbarConfig } from "@/config/toolbar";

export function createHotkeysExtension(): Extension {
  const KEY_MAP = handleHotkeys(toolbarConfig.getAllToolbars());
  return keymap.of([
    ...Object.entries(KEY_MAP).map(([key, value]) => ({
      key,
      ...value,
    })),
  ]);
}
