import { Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { handleHotkeys } from "@/utils/handle-hotkeys";
// import { toolbarConfig } from "@/config/toolbar";
import { ToolbarItem } from "@/types/toolbar";

export function createHotkeysExtension(toolbars: ToolbarItem[]): Extension {
  // const KEY_MAP = handleHotkeys(toolbarConfig.getAllToolbars());
  const KEY_MAP = handleHotkeys(toolbars);
  return keymap.of([
    ...Object.entries(KEY_MAP).map(([key, value]) => ({
      key,
      ...value,
    })),
  ]);
}
