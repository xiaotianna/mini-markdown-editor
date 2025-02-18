import { GlobalConfig } from "@/types/global-config";
import { EditorView } from "@uiw/react-codemirror";

class Global {
  private config: GlobalConfig = {};
  private view: EditorView | null = null;

  public setGlobalConfig(config: GlobalConfig, view: EditorView) {
    this.config = config;
    this.view = view;
  }

  public saveHotKeyHandle() {
    if (!this.view) {
      return;
    }
    const content = this.view.state.doc.toString();
    const onSave = this.config.onSave;
    if (content) {
      // onSave回调
      if (onSave) {
        onSave(content, this.view!);
      }
    }
  }
}

export const global = new Global();
