import SaveIcon from "@/assets/images/save.svg?raw";
import IconTooltip from "../base/IconTooltip";
import { Hotkey } from "@/common/hotkeys";
import { useSaveContent } from "@/hooks/use-save-content";
import { useEditorContentStore } from "@/store/editor";
import { useGlobalConfig } from "@/hooks/use-global-config";
import { t, type TRANSLATION_KEYS } from "@/locales";
import { TOOLBAR_KEYS } from "@/locales/keys";

const Save = () => {
  const { content, editorView } = useEditorContentStore();
  const saveContent = useSaveContent();
  const { onSave } = useGlobalConfig();

  const handleSave = () => {
    if (content) {
      saveContent(content);
      // onSave回调
      if (onSave) {
        onSave(content, editorView!);
      }
    }
  };

  return (
    <IconTooltip
      content={t(TOOLBAR_KEYS.TOOLBAR.save as TRANSLATION_KEYS)}
      description={Hotkey.SAVE.readableCommand}
      onClick={handleSave}
    >
      <div className="icon" dangerouslySetInnerHTML={{ __html: SaveIcon }} />
    </IconTooltip>
  );
};

export default Save;
