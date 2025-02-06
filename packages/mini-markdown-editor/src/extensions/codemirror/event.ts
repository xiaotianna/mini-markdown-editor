import { EditorView, ViewPlugin } from "@uiw/react-codemirror";
import { nanoid } from "nanoid";

interface EventOptions {
  scrollWrapper: string;
  eventExt?: ViewPlugin<{
    dom?: HTMLElement;
    view: EditorView;
    destroy(): void;
  }>;
}

// 实例属性
// 提供销毁方法，同时有效避免全局 Url 的变量污染
class ImageHandler {
  private currentObjectURL: string | null = null;

  handleImageFile(file: File, view: EditorView) {
    // TODO: 限制图片大小（可以外露）
    // if (file.size > 5 * 1024 * 1024) {
    //   console.warn("图片大小不能超过5MB！");
    //   return;
    // }

    if (this.currentObjectURL) {
      URL.revokeObjectURL(this.currentObjectURL);
    }

    const imageUrl = URL.createObjectURL(file);
    this.currentObjectURL = imageUrl;
    //* 生成随机八位 alt
    const imageAlt = nanoid(8);

    const selection = view.state.selection.main;
    const content = `![${imageAlt}](${imageUrl})`;

    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: content,
      },
    });
  }

  destroy() {
    if (this.currentObjectURL) {
      URL.revokeObjectURL(this.currentObjectURL);
    }
  }
}

// 创建拖拽插件
const createDropPhotoExtension = () => {
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

          this.handler.handleImageFile(files[0], view);
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
const createPastePhotoExtension = () => {
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
                this.handler.handleImageFile(file, view);
                //! 只处理第一个图片
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

  return [eventOptions.eventExt, createDropPhotoExtension(), createPastePhotoExtension()].filter(
    Boolean,
  );
};
