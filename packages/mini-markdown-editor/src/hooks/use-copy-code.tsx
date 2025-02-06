import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CopyButton } from "@/components/Preview/CopyCodeButton";

export const useCopyCode = ({
  previewRef,
  node,
}: {
  previewRef: React.RefObject<HTMLDivElement>;
  node: string;
}) => {
  //* 存储清理函数
  const cleanupRef = useRef<(() => void) | null>(null);
  // 处理代码块复制按钮
  useEffect(() => {
    if (!previewRef.current) return;
    // 清理之前的按钮
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    // 添加新的按钮
    const addCopyButtons = () => {
      const codeHeaders = previewRef.current?.querySelectorAll(".mini-md-code-right");
      const currentRoots = new Map<HTMLElement, Root>();

      codeHeaders?.forEach((header: Element) => {
        try {
          if (header.querySelector(".copy-code-button")) return;

          const codeElement = header.closest(".mini-md-code-container")?.querySelector("code");
          if (!codeElement) return;

          const copyButtonContainer = document.createElement("div");
          copyButtonContainer.className = "copy-code-button-wrapper";

          const root = createRoot(copyButtonContainer);
          currentRoots.set(copyButtonContainer, root);

          root.render(<CopyButton content={codeElement.textContent || ""} />);

          header.appendChild(copyButtonContainer);
        } catch (error) {
          console.error("Copy Error:", error);
        }
      });

      // 保存清理函数
      cleanupRef.current = () => {
        setTimeout(() => {
          currentRoots.forEach((root, container) => {
            try {
              root.unmount();
              container.remove();
            } catch (error) {
              console.error("Failed to cleanup copy button:", error);
            }
          });
          currentRoots.clear();
        }, 0);
      };
    };

    // 防止添加按钮时dom未渲染
    requestAnimationFrame(() => {
      addCopyButtons();
    });

    return () => {
      // 组件卸载时执行清理，把清理函数执行
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [node]);
};
