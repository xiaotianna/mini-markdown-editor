import { EDITOR_CONTENT_KEY } from "@/common";
import { safeLocalStorage } from "@/utils/storage";
import { useDebounceFn } from "ahooks";

export const useSaveContent = () => {
  const localStorage = safeLocalStorage();
  const { run: saveContent } = useDebounceFn(
    (content: string) => {
      localStorage.setItem(EDITOR_CONTENT_KEY, content);
    },
    { wait: 300 },
  );

  return saveContent;
};
