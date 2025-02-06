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

let currentObjectURL: string | null = null;

// 处理图片
const handleImageFile = (file: File, view: EditorView) => {
  // TODO: 限制图片大小
  // if (file.size > 5 * 1024 * 1024) {
  //   console.warn("图片大小不能超过5MB！");
  //   return;
  // }

  if (currentObjectURL) {
    URL.revokeObjectURL(currentObjectURL);
  }

  const imageUrl = URL.createObjectURL(file);
  currentObjectURL = imageUrl;
  // alt 设置随机八位
  const imageAlt = nanoid(8);

  // 获取当前选区
  const selection = view.state.selection.main;

  // 直接在 view 中处理插入
  const content = `![${imageAlt}](${imageUrl})`;

  // 直接替换当前选区内容
  view.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: content,
    },
  });
};

// 创建拖拽插件
const createDropPlugin = () => {
  return ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        view.dom.addEventListener("dragover", (e: DragEvent) => {
          e.preventDefault();
        });
        view.dom.addEventListener("drop", (e: DragEvent) => {
          e.preventDefault();

          const files = e.dataTransfer?.files;
          if (!files || files.length === 0) return;

          const file = files[0];
          if (!file.type.startsWith("image/")) {
            // Only image files are supported
            console.warn("只支持图片格式的文件");
            return;
          }
          // 处理图片文件
          handleImageFile(file, view);
        });
      }

      destroy() {
        if (currentObjectURL) {
          URL.revokeObjectURL(currentObjectURL);
          currentObjectURL = null;
        }
      }
    },
  );
};

// 创建粘贴插件
const createPastePlugin = () => {
  return ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        view.dom.addEventListener("paste", (e: ClipboardEvent) => {
          const items = e.clipboardData?.items;
          if (!items) return;

          // 检查是否有图片内容
          let hasImageContent = false;
          for (const item of items) {
            if (item.type.startsWith("image/")) {
              hasImageContent = true;
              break;
            }
          }

          // 如果没有图片内容，使用默认粘贴行为
          if (!hasImageContent) {
            return;
          }

          // 阻止默认粘贴行为
          e.preventDefault();

          for (const item of items) {
            if (item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (file) {
                handleImageFile(file, view);
                break;
              }
            }
          }
        });
      }

      destroy() {
        if (currentObjectURL) {
          URL.revokeObjectURL(currentObjectURL);
          currentObjectURL = null;
        }
      }
    },
  );
};

export const createEventExtension = (eventOptions: EventOptions): any => {
  if (eventOptions.scrollWrapper !== "editor") {
    return [];
  }

  return [eventOptions.eventExt, createDropPlugin(), createPastePlugin()].filter(Boolean);
};
