import { FC } from "react";
import { parseMarkdown, transformHtml } from "@mini-markdown/ast-parser";
import "@/assets/styles/preview.css";
import "highlight.js/styles/atom-one-dark.css";
import styled from "styled-components";
import { scrollSync } from "@/utils/scroll-sync";
import { useEditorContentStore } from "@/store/editor-content";

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px;
`;

const Preview: FC<{ content: string }> = ({ content }) => {
  const ast = parseMarkdown(content);
  const node = transformHtml(ast);

  const { scrollWrapper, setScrollWrapper } = useEditorContentStore();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollWrapper !== "preview") return;
    scrollSync({
      toScrollInstance: e.currentTarget,
      fromScrollInstance: document.querySelector(".cm-scroller"),
    });
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
    >
      <div dangerouslySetInnerHTML={{ __html: node.toString() }}></div>
    </ScrollWrapper>
  );
};
export default Preview;
