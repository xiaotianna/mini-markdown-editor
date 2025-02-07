import { Callback } from "@/types/global-config";
import { EditorView, ViewPlugin } from "@uiw/react-codemirror";

export interface EventOptions {
  scrollWrapper: string;
  eventExt?: ViewPlugin<{
    dom?: HTMLElement;
    view: EditorView;
    destroy(): void;
  }>;
  onDragUpload?: (file: File, callback: Callback) => void;
  onPasteUpload?: (file: File, callback: Callback) => void;
}
