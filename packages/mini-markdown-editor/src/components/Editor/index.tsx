import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import CodeMirror, { type EditorView, ViewUpdate } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import * as events from "@uiw/codemirror-extensions-events";
import { useEditorContentStore } from "@/store/editor";
import { handleEditorScroll } from "@/utils/handle-scroll";
import { useEditorShortcuts } from "@/hooks/use-editor-shortcuts";
import { HotkeysContext } from "../providers/hotkeys-provider";
import { usePersistEditorContent } from "@/hooks/use-persist-editor-content";

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

const Editor: FC<{ isSyncScroll: boolean }> = ({ isSyncScroll }) => {
  const {
    content,
    setContent,
    scrollWrapper,
    setScrollWrapper,
    setEditorView,
    previewView,
    editorView,
  } = useEditorContentStore();
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
  // 监听快捷键
  useEditorShortcuts();
  // 持久化存储内容
  const { saveContent, getContent } = usePersistEditorContent();

  // 处理重加载后的光标位置
  useEffect(() => {
    if (editorView && content) {
      // 将光标移动到文档末尾
      editorView.dispatch({
        selection: { anchor: content.length, head: content.length },
      });
    }
  }, [editorView]);

  // 初始化时获取本地存储的内容
  useEffect(() => {
    setContent(getContent());
  }, []);

  // 编辑器挂载完成后将编辑器示例存储起来
  const handleCreate = (view: EditorView) => {
    setEditorViewInstance(view);
  };

  const handleChange = (val: string, editView: ViewUpdate) => {
    // 更新store
    setContent(val);
    // 本地同步存储
    saveContent(val);
    // 更新编辑器实例
    setEditorViewInstance(editView.view);
  };

  const eventExt = events.scroll({
    scroll: () => {
      if (scrollWrapper !== "editor") return;
      const view = editorViewRef.current;
      console.log(view);
      if (!(view && previewView && isSyncScroll)) return;
      console.log(isSyncScroll);
      handleEditorScroll({ editorView: view, previewView });
    },
  });

  const handleMouseEnter = () => {
    setScrollWrapper("editor");
  };

  const { createKeymapExtension } = useContext(HotkeysContext);
  // 创建扩展数组
  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      scrollWrapper === "editor" ? eventExt : [],
      createKeymapExtension!(),
    ],
    [scrollWrapper, createKeymapExtension],
  );

  return (
    <ScrollWrapper>
      <CodeMirror
        className="markdown-editor-content"
        onCreateEditor={handleCreate}
        value={content}
        extensions={extensions}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          searchKeymap: false,
          autocompletion: false,
          defaultKeymap: false,
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
