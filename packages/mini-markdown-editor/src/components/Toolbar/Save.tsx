import SaveIcon from "@/assets/images/save.svg?raw";
import IconTooltip from "../base/IconTooltip";
import { Hotkey } from "@/common/hotkeys";
import { useSaveContent } from "@/hooks/use-save-content";
import { useEditorContentStore } from "@/store/editor";
import { useContext } from "react";
import { ConfigContext } from "../providers/config-provider";

const Save = () => {
  const { content, editorView } = useEditorContentStore();
  const saveContent = useSaveContent();
  const { onSave } = useContext(ConfigContext);

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
    <IconTooltip content={"保存"} description={Hotkey.SAVE.readableCommand} onClick={handleSave}>
      <div className="icon" dangerouslySetInnerHTML={{ __html: SaveIcon }} />
    </IconTooltip>
  );
};

export default Save;
