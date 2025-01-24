import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

let editorElementList: number[] = [];
let previewElementList: number[] = [];

const computedTop = ({
  previewView,
  editorRef,
}: {
  previewView: HTMLElement | null;
  editorRef: React.RefObject<ReactCodeMirrorRef>;
}) => {
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

const handleEditorScroll = (
  editorRef: React.RefObject<ReactCodeMirrorRef>,
  previewView: HTMLElement | null,
) => {
  computedTop({ editorRef, previewView });

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
  if (editorScrollInfo.scrollTop >= editorScrollInfo.scrollHeight - editorScrollInfo.clientHeight) {
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

const handlePreviewScroll = (
  previewView: HTMLElement | null,
  editorRef: React.RefObject<ReactCodeMirrorRef>,
) => {
  computedTop({ previewView, editorRef });

  const previewScrollInfo = previewView;
  const editorScrollInfo = editorRef.current?.view?.scrollDOM;
  if (!previewScrollInfo || !editorScrollInfo) return;

  // 找到当前滚动位置对应的节点索引
  let scrollElementIndex = previewElementList.length - 1;
  for (let i = 0; i < previewElementList.length - 1; i++) {
    if (previewScrollInfo.scrollTop < previewElementList[i + 1]) {
      scrollElementIndex = i;
      break;
    }
  }

  // 预览区域已经滚动到底部，那么编辑区域也直接滚动到底部
  if (
    previewScrollInfo.scrollTop >=
    previewScrollInfo.scrollHeight - previewScrollInfo.clientHeight
  ) {
    const targetScrollTop = editorScrollInfo.scrollHeight - editorScrollInfo.clientHeight;
    const currentScrollTop = editorScrollInfo.scrollTop;
    const distance = targetScrollTop - currentScrollTop;
    const duration = 100; // 滚动动画持续时间，单位毫秒
    let start: number;

    function step(timestamp: number) {
      if (start === undefined) start = timestamp;
      const time = timestamp - start;
      const percent = Math.min(time / duration, 1);
      editorScrollInfo!.scrollTop = currentScrollTop + distance * percent;
      if (time < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
    return;
  }

  if (scrollElementIndex < previewElementList.length - 1) {
    const currentPreviewPos = previewElementList[scrollElementIndex];
    const nextPreviewPos = previewElementList[scrollElementIndex + 1];
    const currentEditorPos = editorElementList[scrollElementIndex];
    const nextEditorPos = editorElementList[scrollElementIndex + 1];

    // 计算滚动比例时考虑元素高度
    const previewDistance = nextPreviewPos - currentPreviewPos;
    const editorDistance = nextEditorPos - currentEditorPos;

    // 添加最小距离阈值，避免小距离计算导致的跳动
    const MIN_DISTANCE = 10;
    if (previewDistance < MIN_DISTANCE || editorDistance < MIN_DISTANCE) {
      return;
    }

    // 计算滚动比例
    const ratio = Math.max(
      0,
      Math.min(1, (previewScrollInfo.scrollTop - currentPreviewPos) / previewDistance),
    );
    requestAnimationFrame(() => {
      editorScrollInfo.scrollTop = currentEditorPos + editorDistance * ratio;
    });
  }
};

export { handleEditorScroll, handlePreviewScroll };
