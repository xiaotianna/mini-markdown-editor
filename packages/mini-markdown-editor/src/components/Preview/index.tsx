import { FC, useEffect, useRef } from "react";
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
  // store
  const { scrollWrapper, setScrollWrapper, setPreviewView, editorView } = useEditorContentStore();

  // 渲染 html 节点
  const node = React.useMemo(() => {
    const ast = parseMarkdown(content);
    return transformHtml(ast);
  }, [content]);
  const previewRef = useRef<HTMLDivElement>(null);

  // 更新渲染实例
  useEffect(() => {
    if (previewRef.current && node) {
      setPreviewView(previewRef.current);
    }
  }, [node]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollWrapper !== "preview") return;
    const previewView = e.currentTarget;
    if (!(editorView && previewView && isSyncScroll)) return;
    handlePreviewScroll({ previewView, editorView });
  };

  const handleMoseEnter = () => {
    setScrollWrapper("preview");
  };

  return (
    // className='markdown-editor-preview' 重置样式的节点
    <ScrollWrapper
      className="markdown-editor-preview"
      onScroll={handleScroll}
      onMouseEnter={handleMoseEnter}
      ref={previewRef}
      dangerouslySetInnerHTML={{ __html: node.toString() }}
    ></ScrollWrapper>
  );
};
export default Preview;
