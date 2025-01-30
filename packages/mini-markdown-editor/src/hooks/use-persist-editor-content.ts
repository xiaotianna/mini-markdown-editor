import { EDITOR_CONTENT_KEY } from "@/common";
import { ConfigContext } from "@/components/providers/config-provider";
import { safeLocalStorage } from "@/utils/storage";
import { useContext } from "react";

export const usePersistEditorContent = () => {
  const localStorage = safeLocalStorage();
  const { local } = useContext(ConfigContext);

  // 保存内容
  const saveContent = (content: string) => {
    if (local) {
      localStorage.setItem(EDITOR_CONTENT_KEY, content);
    }
  };

  // 获取内容
  const getContent = (): string => {
    if (!local) return "";
    return localStorage.getItem(EDITOR_CONTENT_KEY) ?? "";
  };

  return { saveContent, getContent };
};
