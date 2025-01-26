import React, { createContext, useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Hotkey } from "@/common/hotkeys";
import { keymap } from "@codemirror/view";
import type { KeyBinding } from "@codemirror/view";
import { Extension } from "@uiw/react-codemirror";

interface HotkeysContextValue {
  registerHandler?: (hotkey: Hotkey, handler: () => void) => void;
  unregisterHandler?: (hotkey: Hotkey) => void;
  isEnabled?: boolean;
  setEnabled?: (enabled: boolean) => void;
  createKeymapExtension?: () => Extension;
  handleKeyEvent?: (event: KeyboardEvent) => boolean;
}

export const HotkeysContext = createContext<HotkeysContextValue>({
  registerHandler: () => {},
  unregisterHandler: () => {},
});

interface HotkeysProviderProps {
  children: React.ReactNode;
  // 是否启用快捷键
  enabled?: boolean;
}

// ---
// 将 Hotkey 命令转换为 CodeMirror 键映射格式（蜜汁标准）
// TODO: 可以更简洁一些
function convertToCodeMirrorKey(command: string): string {
  return command
    .split("+")
    .map((key) => {
      switch (key) {
        case "mod":
          return "Mod";
        case "shift":
          return "Shift";
        case "alt":
          return "Alt";
        case "ctrl":
          return "Ctrl";
        default:
          return key.charAt(0).toUpperCase() + key.slice(1);
      }
    })
    .join("-");
}

// TODO: 用开关控制热键是否启用
export function HotkeysProvider({ children, enabled = true }: HotkeysProviderProps) {
  const [handlers] = React.useState(new Map<string, () => void>());
  const [isEnabled, setEnabled] = React.useState(enabled);

  // 注册快捷键
  const registerHandler = useCallback(
    (hotkey: Hotkey, handler: () => void) => {
      handlers.set(hotkey.command, handler);
    },
    [handlers],
  );

  // 取消注册（用于生命周期后期的销毁）
  const unregisterHandler = useCallback(
    (hotkey: Hotkey) => {
      handlers.delete(hotkey.command);
    },
    [handlers],
  );

  // 统一的事件处理函数
  const handleKeyEvent = useCallback(
    (event: KeyboardEvent): boolean => {
      if (!isEnabled) return false;

      const pressedKeys = [];
      if (event.metaKey || event.ctrlKey) pressedKeys.push("mod");
      if (event.shiftKey) pressedKeys.push("shift");
      if (event.altKey) pressedKeys.push("alt");
      pressedKeys.push(event.key.toLowerCase());

      const command = pressedKeys.join("+");
      // 测试使用
      // console.log("Pressed command:", command);

      const handler = handlers.get(command);
      if (handler) {
        event.preventDefault();
        handler();
        return true;
      }
      return false;
    },
    [handlers, isEnabled],
  );

  // 创建 CodeMirror 扩展
  const createKeymapExtension = useCallback(() => {
    const keyBindings: KeyBinding[] = [];
    handlers.forEach((handler, command) => {
      // 转换映射格式
      const cmKey = convertToCodeMirrorKey(command);
      keyBindings.push({
        key: cmKey,
        run: () => {
          if (!isEnabled) return false;
          handler();
          return true;
        },
        preventDefault: true,
      });
    });
    return keymap.of(keyBindings);
  }, [handlers, isEnabled]);

  // 全局热键处理
  useHotkeys(
    "*",
    (event: KeyboardEvent) => {
      handleKeyEvent(event);
    },
    {
      enableOnFormTags: true,
    },
  );

  const value = useMemo(
    () => ({
      registerHandler,
      unregisterHandler,
      isEnabled,
      setEnabled,
      createKeymapExtension,
      handleKeyEvent,
    }),
    [registerHandler, unregisterHandler, isEnabled, createKeymapExtension, handleKeyEvent],
  );

  return <HotkeysContext.Provider value={value}>{children}</HotkeysContext.Provider>;
}
