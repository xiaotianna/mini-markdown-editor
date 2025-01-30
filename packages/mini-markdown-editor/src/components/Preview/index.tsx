import { FC, useEffect, useRef, useCallback } from "react";
import { parseMarkdown, transformHtml } from "@mini-markdown/ast-parser";
import "@/assets/styles/preview.css";
import "highlight.js/styles/atom-one-dark.css";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import { handlePreviewScroll } from "@/utils/handle-scroll";
import React from "react";

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px;
  word-wrap: break-word;
`;

const Preview: FC<{ content: string; isSyncScroll: boolean }> = ({ content, isSyncScroll }) => {
  const { scrollWrapper, setScrollWrapper, setPreviewView, editorView } = useEditorContentStore();

  const previewRef = useRef<HTMLDivElement>(null);

  // 更新预览视图
  const updatePreviewView = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        setPreviewView(element);
      }
    },
    [setPreviewView],
  );

  // 渲染 html 节点
  const node = React.useMemo(() => {
    const ast = parseMarkdown(content);
    return transformHtml(ast);
  }, [content]);

  // 更新渲染实例
  useEffect(() => {
    updatePreviewView(previewRef.current);
  }, [updatePreviewView, node]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (scrollWrapper !== "preview") return;
      const previewView = e.currentTarget;
      if (!(editorView && previewView && isSyncScroll)) return;
      handlePreviewScroll({ previewView, editorView });
    },
    [scrollWrapper, editorView, isSyncScroll],
  );

  const handleMouseEnter = useCallback(() => {
    setScrollWrapper("preview");
  }, [setScrollWrapper]);

  return (
    <ScrollWrapper
      className="markdown-editor-preview"
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      ref={previewRef}
      dangerouslySetInnerHTML={{ __html: node.toString() }}
    />
  );
};

export default React.memo(Preview);
