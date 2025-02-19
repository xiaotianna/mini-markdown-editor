import { ToolbarItem, ToolbarType } from "@/types/toolbar";
import { BaseToolbarType } from "@/types/toolbar";
import { useToolbarStore } from "@/store/toolbar";
import { InsertTextEvent } from "@/config/toolbar/event";
import { global } from "./set-global-config";

// 定义处理器类型
interface HotkeyHandler {
  run: () => boolean;
  preventDefault: boolean;
}

// 定义热键类型
interface HotkeyType {
  command: string;
  description: string;
  handle?: () => void;
}

// 创建文本插入类型的处理器
export const createInsertTextHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    if (hotkey.handle) {
      hotkey.handle?.();
      return true;
    }
    InsertTextEvent(hotkey.description as ToolbarType);
    return true;
  },
  preventDefault: true,
});

// 创建全屏切换处理器
export const createFullScreenHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    const currentState = useToolbarStore.getState();
    useToolbarStore.setState({
      isFullScreen: !currentState.isFullScreen,
    });
    hotkey.handle?.();
    return true;
  },
  preventDefault: true,
});

// 创建保存处理器
export const createSaveHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    hotkey.handle?.();
    global.saveHotKeyHandle();
    return true;
  },
  preventDefault: true,
});

// 创建自定义处理器
export const createCustomHandler = (hotkey: HotkeyType): HotkeyHandler => ({
  run: () => {
    hotkey.handle?.();
    return true;
  },
  preventDefault: true,
});

// 判断是否为基础工具栏类型（判断是否为新添加的工具）
const isBaseToolbarType = (type: string): type is BaseToolbarType => {
  return Object.values(BaseToolbarType).includes(type as BaseToolbarType);
};

// 创建对应类型的处理器
const createHandler = (item: ToolbarItem): HotkeyHandler | null => {
  if (!item.hotkey) return null;

  switch (item.type) {
    case BaseToolbarType.FULLSCREEN:
      return createFullScreenHandler(item.hotkey);
    case BaseToolbarType.SAVE:
      return createSaveHandler(item.hotkey);
    default:
      if (isBaseToolbarType(item.type)) {
        return createInsertTextHandler(item.hotkey);
      }
      // 对于自定义类型，使用createCustomHandler
      return createCustomHandler(item.hotkey);
  }
};

// 处理单个工具栏项
const processToolbarItem = (result: Record<string, HotkeyHandler>, item: ToolbarItem): void => {
  const handler = createHandler(item);
  if (item.hotkey && handler) {
    result[item.hotkey.command] = handler;
  }

  // 处理子列表
  if (item.list?.length) {
    item.list.forEach((listItem) => {
      if (listItem.hotkey) {
        const listItemHandler = createHandler(listItem);
        if (listItemHandler) {
          result[listItem.hotkey.command] = listItemHandler;
        }
      }
    });
  }
};

export const handleHotkeys = (toolbar: ToolbarItem[]): Record<string, HotkeyHandler> => {
  const result: Record<string, HotkeyHandler> = {};
  toolbar.forEach((item) => processToolbarItem(result, item));
  return result;
};
