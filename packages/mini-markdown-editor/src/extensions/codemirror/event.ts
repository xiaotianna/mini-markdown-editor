import { EditorView, ViewPlugin } from "@uiw/react-codemirror";
import { nanoid } from "nanoid";
import type { EventOptions } from "./event.d";
import { Callback } from "@/types/global-config";

// 实例属性
// 提供销毁方法，同时有效避免全局 Url 的变量污染
class ImageHandler {
  private currentObjectURL: string | null = null;

  handleImageFile(
    file: File,
    view: EditorView,
    uploadCallback?: (file: File, callback: Callback) => void,
  ) {
    if (this.currentObjectURL) {
      URL.revokeObjectURL(this.currentObjectURL);
    }

    // 创建临时URL
    const temporaryUrl = URL.createObjectURL(file);
    this.currentObjectURL = temporaryUrl;
    const imageAlt = nanoid(8);

    // 插入临时图片用作预览
    const selection = view.state.selection.main;
    const content = `![${imageAlt}](${temporaryUrl})\n`;
    const insertPos = selection.from;

    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: content,
      },
      selection: {
        anchor: selection.from + content.length,
        head: selection.from + content.length,
      },
    });

    // 处理上传后的信息
    //! 此回调函数内部提供返回的url，作为新图片的地址
    //! 可选传递alt参数，作为图片的描述
    const handleCallback: Callback = (param: { url: string; alt?: string }) => {
      try {
        const newContent = `![${param.alt || imageAlt}](${param.url})\n`;

        // 计算需要替换的范围
        const doc = view.state.doc;
        const searchStr = content;
        const searchPos = doc.slice(insertPos, insertPos + searchStr.length).toString();
        if (searchPos === searchStr) {
          view.dispatch({
            changes: {
              from: insertPos,
              to: insertPos + searchStr.length,
              insert: newContent,
            },
          });
        }

        // 清理临时URL
        URL.revokeObjectURL(temporaryUrl);
        this.currentObjectURL = null;
      } catch (err) {
        console.error("Failed to replace image URL:", err);
      }
    };

    // 执行上传回调
    if (uploadCallback) {
      uploadCallback(file, handleCallback);
    }
  }

  destroy() {
    if (this.currentObjectURL) {
      URL.revokeObjectURL(this.currentObjectURL);
    }
  }
}

// 创建拖拽插件
const createDropPhotoExtension = (onDragUpload?: EventOptions["onDragUpload"]) => {
  return ViewPlugin.fromClass(
    class {
      private handler: ImageHandler;
      private onDragOver: (e: DragEvent) => void;
      private onDrop: (e: DragEvent) => void;
      private view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.handler = new ImageHandler();

        this.onDragOver = (e: DragEvent) => e.preventDefault();
        this.onDrop = (e: DragEvent) => {
          e.preventDefault();
          const files = e.dataTransfer?.files;
          if (!files?.[0]?.type.startsWith("image/")) return;

          this.handler.handleImageFile(files[0], view, onDragUpload);
        };

        this.view.dom.addEventListener("dragover", this.onDragOver);
        this.view.dom.addEventListener("drop", this.onDrop);
      }

      destroy() {
        // 必须要移除事件监听，如果不移除的话会重复绑定
        this.view.dom.removeEventListener("dragover", this.onDragOver);
        this.view.dom.removeEventListener("drop", this.onDrop);
        this.handler.destroy();
      }
    },
  );
};

// 创建粘贴插件
const createPastePhotoExtension = (onPasteUpload?: EventOptions["onPasteUpload"]) => {
  return ViewPlugin.fromClass(
    class {
      private handler: ImageHandler;
      private onPaste: (e: ClipboardEvent) => void;
      private view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.handler = new ImageHandler();

        this.onPaste = (e: ClipboardEvent) => {
          const items = e.clipboardData?.items;
          if (!items) return;

          for (const item of items) {
            if (item.type.startsWith("image/")) {
              e.preventDefault();
              const file = item.getAsFile();
              if (file) {
                this.handler.handleImageFile(file, view, onPasteUpload);
                break;
              }
            }
          }
        };

        this.view.dom.addEventListener("paste", this.onPaste);
      }

      destroy() {
        // 必须要移除事件监听，如果不移除的话会重复绑定
        this.view.dom.removeEventListener("paste", this.onPaste);
        this.handler.destroy();
      }
    },
  );
};

export const createEventExtension = (eventOptions: EventOptions): any => {
  if (eventOptions.scrollWrapper !== "editor") {
    return [];
  }

  return [
    eventOptions.eventExt,
    createDropPhotoExtension(eventOptions.onDragUpload),
    createPastePhotoExtension(eventOptions.onPasteUpload),
  ].filter(Boolean);
};
