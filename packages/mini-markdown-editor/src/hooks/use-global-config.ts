import { ConfigContext } from "@/components/providers/config-provider";
import { useContext, useEffect } from "react";
import { global } from "../utils/set-global-config";
import { useEditorContentStore } from "@/store/editor";

export const useGlobalConfig = () => {
  const context = useContext(ConfigContext);
  const editorView = useEditorContentStore((state) => state.editorView);
  useEffect(() => {
    if (context && editorView) {
      global.setGlobalConfig(context, editorView);
    }
  });

  if (!context) {
    throw new Error("GlobalConfig init error");
  }
  return context;
};
