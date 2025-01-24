import { FC, useRef } from "react";
import styled from "styled-components";
import CodeMirror, { type EditorView, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import * as events from "@uiw/codemirror-extensions-events";
import { useEditorContentStore } from "@/store/editor";

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
  const { content, setContent, scrollWrapper, setScrollWrapper, setEditorView, previewView } =
    useEditorContentStore();
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  // 编辑器挂载完成后将编辑器示例存储起来
  const handleCreate = (view: EditorView) => {
    setEditorView(view);
  };

  const handleChange = (val: string) => {
    setContent(val);
  };

  const handleScroll = () => {
    let editorElementList: number[] = [];
    let previewElementList: number[] = [];
    const computedTop = () => {
      const nodeArr = Array.from(previewView!.childNodes).filter((n: ChildNode) => {
        if ((n as HTMLElement).clientHeight === 0 && n.nodeName === "P") {
          return;
        }
        return n;
      });
      editorElementList = [];
      previewElementList = [];
      const editorInstance = editorRef.current;
      nodeArr.forEach((node) => {
        const lineAtr = (node as HTMLElement).getAttribute("data-line");
        if (!lineAtr) return;
        const lineNumber = Number(lineAtr);
        // 确保行号在有效范围内
        if (
          lineNumber < 1 ||
          !editorInstance?.state?.doc ||
          lineNumber > editorInstance.state.doc.lines
        ) {
          return;
        }
        const line = editorInstance?.state?.doc?.line(lineNumber);
        const lineBlock = editorInstance?.view?.lineBlockAt(line!.from);
        const topHeight = lineBlock!.top;
        editorElementList.push(topHeight);
        previewElementList.push((node as HTMLElement).offsetTop);
      });
    };
    computedTop();

    const editorScrollInfo = editorRef.current?.view?.scrollDOM;
    if (!editorScrollInfo || !previewView) return;

    // 找到当前滚动位置对应的节点索引
    let scrollElementIndex = editorElementList.length - 1;
    for (let i = 0; i < editorElementList.length - 1; i++) {
      if (editorScrollInfo.scrollTop < editorElementList[i + 1]) {
        scrollElementIndex = i;
        break;
      }
    }

    // 编辑区域已经滚动到底部，那么预览区域也直接滚动到底部
    if (
      editorScrollInfo.scrollTop >=
      editorScrollInfo.scrollHeight - editorScrollInfo.clientHeight
    ) {
      const targetScrollTop = previewView.scrollHeight - previewView.clientHeight;
      const currentScrollTop = previewView.scrollTop;
      const distance = targetScrollTop - currentScrollTop;
      const duration = 100; // 滚动动画持续时间，单位毫秒
      let start: number;

      function step(timestamp: number) {
        if (start === undefined) start = timestamp;
        const time = timestamp - start;
        const percent = Math.min(time / duration, 1);
        previewView!.scrollTop = currentScrollTop + distance * percent;
        if (time < duration) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
      return;
    }

    if (scrollElementIndex < editorElementList.length - 1) {
      const currentEditorPos = editorElementList[scrollElementIndex];
      const nextEditorPos = editorElementList[scrollElementIndex + 1];
      const currentPreviewPos = previewElementList[scrollElementIndex];
      const nextPreviewPos = previewElementList[scrollElementIndex + 1];

      // 计算滚动比例时考虑元素高度
      const editorDistance = nextEditorPos - currentEditorPos;
      const previewDistance = nextPreviewPos - currentPreviewPos;

      // 添加最小距离阈值，避免小距离计算导致的跳动
      const MIN_DISTANCE = 10;
      if (editorDistance < MIN_DISTANCE || previewDistance < MIN_DISTANCE) {
        return;
      }

      // 计算滚动比例
      const ratio = Math.max(
        0,
        Math.min(1, (editorScrollInfo.scrollTop - currentEditorPos) / editorDistance),
      );
      requestAnimationFrame(() => {
        previewView.scrollTop = currentPreviewPos + previewDistance * ratio;
      });
    }
  };

  const eventExt = events.scroll({
    scroll: () => {
      handleScroll();
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
