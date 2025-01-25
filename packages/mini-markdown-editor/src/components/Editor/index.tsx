import { FC, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import CodeMirror, { type EditorView, ViewUpdate } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import * as events from "@uiw/codemirror-extensions-events";
import { useEditorContentStore } from "@/store/editor";
import { handleEditorScroll } from "@/utils/handle-scroll";
import { safeLocalStorage } from "@/utils/storage";
import { EDITOR_CONTENT_KEY, SYNC_SCROLL_STATUS } from "@/common";

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
    setEditorView,
    previewView,
    editorView,
  } = useEditorContentStore();
  const localStorage = safeLocalStorage();
  // ref转发
  const editorViewRef = useRef<EditorView>();
  // 存储实例
  const setEditorViewInstance = useCallback(
    (view: EditorView) => {
      setEditorView(view);
      editorViewRef.current = view;
    },
    [editorViewRef],
  );

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
    setEditorViewInstance(view);
  };

  const handleChange = (val: string, editView: ViewUpdate) => {
    // 更新store
    setContent(val);
    // 本地同步存储
    localStorage.setItem(EDITOR_CONTENT_KEY, val);
    // 更新编辑器实例
    setEditorViewInstance(editView.view);
  };

  const eventExt = events.scroll({
    scroll: () => {
      if (scrollWrapper !== "editor") return;
      const view = editorViewRef.current;
      if (!(view && previewView && localStorage.getItem(SYNC_SCROLL_STATUS) === "true")) return;
      handleEditorScroll({ editorView: view, previewView });
    },
  });

  const handleMouseEnter = () => {
    setScrollWrapper("editor");
  };

  return (
    <ScrollWrapper>
      <CodeMirror
        className="markdown-editor-content"
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
