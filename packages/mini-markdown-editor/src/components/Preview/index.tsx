import React, { FC, useEffect, useRef, useCallback, useContext } from "react";
import { parseMarkdown, transformHtml } from "@mini-markdown/ast-parser";
import "highlight.js/styles/atom-one-dark.css";
import styled from "styled-components";
import { useEditorContentStore } from "@/store/editor";
import { handlePreviewScroll } from "@/utils/handle-scroll";
import { usePreviewTheme } from "@/hooks/use-preview-theme";
import { ConfigContext } from "../providers/config-provider";

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

  // 设置css变量
  const { theme } = useContext(ConfigContext);
  usePreviewTheme(theme as "light" | "dark");

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

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px;
  word-wrap: break-word;
  color: var(--md-preview-color);
  .mini-md-h1,
  .mini-md-h2,
  .mini-md-h3,
  .mini-md-h4,
  .mini-md-h5,
  .mini-md-h6 {
    width: 100%;
    display: block;
    padding: 0 10px;
    word-wrap: break-word;
    /* color: #3f4a54; */
    color: var(--md-preview-special-color);
    margin: 0.8em 0;
  }

  .mini-md-h1 {
    font-size: 2em;
  }

  .mini-md-h2 {
    font-size: 1.5em;
  }

  .mini-md-h3 {
    font-size: 1.25em;
  }

  .mini-md-h4 {
    font-size: 1em;
  }

  .mini-md-h5 {
    font-size: 0.875em;
  }

  .mini-md-h6 {
    font-size: 0.85em;
  }

  .mini-md-inline-code {
    line-height: 22px;
    padding: 2px 4px;
    /* color: #3594f7; */
    color: var(--md-preview-inlincode-color);
    /* #f1f1f1 */
    /* background-color: rgba(59, 170, 250, 0.1); */
    background-color: var(--md-preview-inlincode-bg-color);
    border-radius: 4px;
  }

  .mini-md-link {
    color: #2d8cf0;
    text-decoration: none;
    transition: color 0.3s;
    cursor: pointer;
  }

  .mini-md-link:hover {
    color: #73d13d;
  }

  .mini-md-image {
    max-width: 100%;
    /* border: 1px solid #e6e6e6; */
    border: 1px solid var(--md-preview-border-color);
    border-radius: 3px;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 5px;
  }

  .mini-md-hr {
    border: none;
    border-top: 1px solid var(--md-preview-border-color);
    height: 1px;
    margin: 10px 0;
  }

  .mini-md-blockquote {
    display: block;
    line-height: 2em;
    margin: 20px 0;
    overflow: auto;
    padding: 0 1.2em;
    /* border-left: 5px solid #d0d7de; */
    border-left: 5px solid var(--md-preview-blockquote-border-color);
    color: var(--md-preview-blockquote-color);
  }

  .mini-md-table {
    width: 50%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  .mini-md-th,
  .mini-md-td {
    /* border: 1px solid #ddd; */
    border: 1px solid var(--md-preview-table-border-color);
    padding: 8px;
    text-align: left;
  }

  .mini-md-th {
    /* background-color: #f2f2f2; */
    background-color: var(--md-preview-th-bg-color);
  }

  .mini-md-tr:hover {
    /* background-color: #f5f5f5; */
    background-color: var(--md-preview-table-hover-bg-color);
  }

  .mini-md-ul,
  .mini-md-ol {
    margin: 0.6em 0;
    padding-inline-start: 30px;
  }

  .mini-md-li::marker {
    color: #1456f0;
  }

  .mini-md-code-container {
    font-size: 12px;
    line-height: 1;
    margin: 20px 0;
    position: relative;
  }

  .mini-md-code-container .mini-md-code-header {
    background-color: #282c34;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    font-size: 12px;
    font-weight: 600;
    height: 32px;
    justify-content: space-between;
    margin-bottom: 0;
    width: 100%;
  }

  .mini-md-code-header .mini-md-code-icon {
    display: flex;
    gap: 5px;
    margin-left: 12px;
  }

  .mini-md-code-header .mini-md-code-icon span {
    border-radius: 50%;
    display: inline-block;
    height: 10px;
    margin-top: 10px;
    width: 10px;
  }

  .mini-md-code-icon span:nth-of-type(1) {
    background-color: #ec6a5e;
  }

  .mini-md-code-icon span:nth-of-type(2) {
    background-color: #f4bf4f;
  }

  .mini-md-code-icon span:nth-of-type(3) {
    background-color: #61c554;
  }

  .mini-md-code-right {
    margin-top: 10px;
    margin-right: 12px;
    color: #a9b7c6;
  }

  .mini-md-code-container pre {
    margin: 0;
  }

  .mini-md-code-container pre code {
    background-color: #282c34;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    color: #a9b7c6;
    display: block;
    font-family:
      source-code-pro,
      Menlo,
      Monaco,
      Consolas,
      Courier New,
      monospace;
    font-size: 14px;
    line-height: 1.6;
    overflow: auto;
    padding: 1em;
  }

  .markdown-editor-preview p {
    margin: 0 !important;
  }
`;
