import { FC, useEffect, useRef } from "react";
import styled from "styled-components";
import CodeMirror, { type EditorView, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import * as events from "@uiw/codemirror-extensions-events";
import { useEditorContentStore } from "@/store/editor";
import { handleEditorScroll } from "@/utils/handle-scroll";
import { safeLocalStorage } from "@/utils/storage";
import { EDITOR_CONTENT_KEY } from "@/common";

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;

  .editor-content {
    width: 100%;
    min-height: 100%;
    font-size: 16px;
    line-height: 24px;
    outline: none;
  }
  .cm-editor {
    outline: none;
    height: 100%;
  }
  .cm-editor.cm-focused {
    outline: none;
  }
  .cm-scroller {
    height: 100%;
  }
`;

const Editor: FC = () => {
  const {
    content,
    setContent,
    scrollWrapper,
    setScrollWrapper,
    editorView,
    setEditorView,
    previewView,
    setEditorRef,
  } = useEditorContentStore();
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const localStorage = safeLocalStorage();

  // 处理重加载后的光标位置
  useEffect(() => {
    if (editorView && content) {
      // 将光标移动到文档末尾
      editorView.dispatch({
        selection: { anchor: content.length, head: content.length },
      });
    }
  }, [editorView]);

  // 编辑器挂载完成后将编辑器示例存储起来
  const handleCreate = (view: EditorView) => {
    setEditorView(view);
    setEditorRef(editorRef);
  };

  const handleChange = (val: string) => {
    setContent(val);
    // 本地同步存储
    localStorage.setItem(EDITOR_CONTENT_KEY, val);
  };

  const eventExt = events.scroll({
    scroll: () => {
      if (scrollWrapper !== "editor") return;
      handleEditorScroll(editorRef, previewView);
    },
  });

  const handleMouseEnter = () => {
    setScrollWrapper("editor");
  };

  return (
    <ScrollWrapper>
      <CodeMirror
        className="markdown-editor-content"
        ref={editorRef}
        onCreateEditor={handleCreate}
        value={content}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          scrollWrapper === "editor" ? eventExt : [],
        ]}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          searchKeymap: false,
          autocompletion: false,
        }}
        autoFocus={true}
        style={{ height: "100%" }}
        onChange={handleChange}
        onMouseEnter={handleMouseEnter}
      />
    </ScrollWrapper>
  );
};

export default Editor;
