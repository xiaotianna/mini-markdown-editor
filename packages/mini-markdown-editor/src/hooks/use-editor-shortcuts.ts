import { Hotkey } from "@/common/hotkeys";
import { HotkeysContext } from "@/components/providers/hotkeys-provider";
import { useContext, useEffect } from "react";

export const useEditorShortcuts = () => {
  const { registerHandler, unregisterHandler } = useContext(HotkeysContext);

  // 方法全部在这里添加
  //! 这里未定义的则按照默认方法执行
  useEffect(() => {
    registerHandler!(Hotkey.TITLE.FIRST, () => {});

    return () => {
      unregisterHandler!(Hotkey.TITLE.FIRST);
      unregisterHandler!(Hotkey.TITLE.THIRD);
    };
  }, [registerHandler, unregisterHandler]);
};
