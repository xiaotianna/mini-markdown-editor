import { EDITOR_CONTENT_KEY } from "@/common";
import { ConfigContext } from "@/components/providers/config-provider";
import { safeLocalStorage } from "@/utils/storage";
import { useDebounceFn } from "ahooks";
import { useContext } from "react";

export const usePersistEditorContent = () => {
  const localStorage = safeLocalStorage();
  const { local } = useContext(ConfigContext);

  // 保存内容
  const { run: saveContent } = useDebounceFn(
    (content: string) => {
      if (local) {
        localStorage.setItem(EDITOR_CONTENT_KEY, content);
      }
    },
    { wait: 300 },
  );

  // 获取内容
  const getContent = (): string => {
    return localStorage.getItem(EDITOR_CONTENT_KEY) ?? "";
  };

  return { saveContent, getContent };
};
