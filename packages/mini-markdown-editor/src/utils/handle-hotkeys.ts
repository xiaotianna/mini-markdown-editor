import { ToolbarItem, ToolbarType } from "@/types/toolbar";
import { useToolbarStore } from "@/store/toolbar";
import { InsertTextEvent } from "@/config/toolbar/event";
import { toolbar } from "@/config/toolbar/base";

// 定义处理器类型
type HotkeyHandler = {
  run: () => boolean;
  preventDefault: boolean;
};
type HotkeyType = {
  command: string;
  description: string;
  handle?: void | (() => void);
};

// 创建文本插入类型的处理器
const createInsertTextHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    hotkey.handle?.();
    InsertTextEvent(hotkey.description as ToolbarType);
    return true;
  },
  preventDefault: true,
});

// 创建全屏切换处理器
const createFullScreenHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    hotkey.handle?.();
    const currentState = useToolbarStore.getState();
    useToolbarStore.setState({
      isFullScreen: !currentState.isFullScreen,
    });
    return true;
  },
  preventDefault: true,
});

// 创建保存处理器
const createSaveHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    hotkey.handle?.();
    // TODO: 添加保存事件
    return true;
  },
  preventDefault: true,
});

// 创建自定义处理器
export const createCustomHandler = (hotkey: HotkeyType, handler: () => boolean): HotkeyHandler => ({
  run: () => {
    hotkey.handle?.();
    return handler();
  },
  preventDefault: true,
});

export const handleHotkeys = () => {
  const result: Record<string, any> = {};

  // 处理为cm可接受hotkeys的格式
  const processItem = (item: ToolbarItem) => {
    // 处理有 hotkey 的项
    if (item.hotkey) {
      if (item.type === "fullscreen") {
        result[item.hotkey.command] = createFullScreenHandler(item.hotkey);
      } else if (item.type === "save") {
        result[item.hotkey.command] = createSaveHandler(item.hotkey);
      } else {
        result[item.hotkey.command] = createInsertTextHandler(item.hotkey);
      }
    }

    // 处理子列表
    if (item.list) {
      item.list.forEach((listItem) => {
        if (listItem.hotkey) {
          result[listItem.hotkey.command] = createInsertTextHandler(listItem.hotkey);
        }
      });
    }
  };

  // 处理所有工具栏项
  toolbar.forEach(processItem);

  return result;
};
