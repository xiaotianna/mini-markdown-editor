import { formatContents, Title } from "@/utils/format-contents";
import { Anchor } from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import { useEditorContentStore } from "@/store/editor";

const Contents: FC = () => {
  const previewView = useEditorContentStore((state) => state.previewView);
  const [titles, setTitles] = useState<Title[]>([]);
  const preview = document.querySelector(".markdown-editor-preview") as HTMLElement | null;
  const getRootElement = () => {
    return preview?.querySelectorAll("h1, h2, h3, h4, h5, h6") as NodeListOf<HTMLElement>;
  };

  const rootElement = useMemo(getRootElement, [preview]);

  // 获取 preview 容器的标题节点
  const addAnchor = () => {
    if (!rootElement) return [];
    rootElement.forEach((node) => {
      const line = node.getAttribute("data-line");
      if (!line) return;
      node.setAttribute("id", line);
    });
    return formatContents(rootElement);
  };

  useEffect(() => {
    if (!preview) return;

    // 初始化时立即执行一次
    if (rootElement.length > 0) {
      setTitles(addAnchor());
    }

    const observer = new MutationObserver(() => {
      // 再获取一次元素，防止更新不及时
      const elements = getRootElement();
      if (elements && elements.length > 0) {
        requestAnimationFrame(() => {
          setTitles(formatContents(elements));
        });
      }
    });

    observer.observe(preview, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [preview, rootElement]);

  // 自定义高亮锚点（默认选中第一个）
  const getCurrentAnchor = (activeLink: string): string => {
    if (!activeLink && titles.length > 0) {
      activeLink = titles[0].href;
    }
    return activeLink;
  };

  const handleClickAnchor = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    link: {
      title: React.ReactNode;
      href: string;
    },
  ) => {
    e.preventDefault();
    if (link.href && previewView) {
      const targetElement = previewView.querySelector(`[data-line="${link.href}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  };

  return titles.length > 0 && preview ? (
    <Anchor
      affix={false}
      items={titles}
      getCurrentAnchor={getCurrentAnchor}
      getContainer={() => preview}
      onClick={handleClickAnchor}
    />
  ) : null;
};

export default Contents;
