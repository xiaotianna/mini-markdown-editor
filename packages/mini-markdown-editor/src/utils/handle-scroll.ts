import { EditorView } from "@uiw/react-codemirror";

interface InstancesType {
  previewView: HTMLElement;
  editorView: EditorView;
}

class Scroll {
  // 用于存放编辑器和预览区高度对应关系
  editorElementList: number[];
  previewElementList: number[];

  constructor() {
    this.editorElementList = [];
    this.previewElementList = [];
  }

  // 计算编辑器和预览区域高度的对应关系
  computedTop({ previewView, editorView }: InstancesType) {
    const nodeArr = Array.from(previewView!.childNodes).filter((n: ChildNode) => {
      if ((n as HTMLElement).clientHeight === 0 && n.nodeName === "P") {
        return;
      }
      return n;
    });
    this.editorElementList = [];
    this.previewElementList = [];
    nodeArr.forEach((node) => {
      const lineAtr = (node as HTMLElement).getAttribute("data-line");
      if (!lineAtr) return;
      // 预览区元素对应编辑区行号
      const lineNumber = Number(lineAtr);
      // 确保行号在有效范围内
      if (lineNumber < 1 || !editorView.state?.doc || lineNumber > editorView.state.doc.lines) {
        return;
      }
      // 获取编辑器区域行号
      const line = editorView.state?.doc?.line(lineNumber);
      // 获取编辑器区域行高
      const lineBlock = editorView.lineBlockAt(line.from);
      // 获取编辑器区域顶部距离
      const topHeight = lineBlock!.top;
      this.editorElementList.push(topHeight);
      this.previewElementList.push((node as HTMLElement).offsetTop);
    });
  }

  // 处理滚动事件
  handleScroll(source: "editor" | "preview", { editorView, previewView }: InstancesType) {
    const editorInstance = editorView;
    const scrollInfo = source === "editor" ? editorInstance.scrollDOM : previewView;
    const targetElement = source === "editor" ? previewView : editorInstance.scrollDOM;

    if (!scrollInfo || !targetElement) return;

    // 找到当前滚动位置对应的节点索引
    const sourceList = source === "editor" ? this.editorElementList : this.previewElementList;
    const targetList = source === "editor" ? this.previewElementList : this.editorElementList;

    let scrollElementIndex = sourceList.length - 1;
    for (let i = 0; i < sourceList.length - 1; i++) {
      if (scrollInfo.scrollTop < sourceList[i + 1]) {
        scrollElementIndex = i;
        break;
      }
    }

    // 源区域已经滚动到底部，那么目标区域也直接滚动到底部
    if (scrollInfo.scrollTop >= scrollInfo.scrollHeight - scrollInfo.clientHeight) {
      const targetScrollTop = targetElement.scrollHeight - targetElement.clientHeight;
      const currentScrollTop = targetElement.scrollTop;
      const distance = targetScrollTop - currentScrollTop;
      const duration = 100; // 滚动动画持续时间，单位毫秒
      let start: number;

      function step(timestamp: number) {
        if (start === undefined) start = timestamp;
        const time = timestamp - start;
        const percent = Math.min(time / duration, 1);
        // 确保 targetElement 存在再进行滚动操作
        if (targetElement) {
          targetElement.scrollTop = currentScrollTop + distance * percent;
          if (time < duration) {
            requestAnimationFrame(step);
          }
        }
      }

      requestAnimationFrame(step);
      return;
    }

    // 目标区域滚动到对应位置
    if (scrollElementIndex < sourceList.length - 1) {
      const currentSourcePos = sourceList[scrollElementIndex];
      const nextSourcePos = sourceList[scrollElementIndex + 1];
      const currentTargetPos = targetList[scrollElementIndex];
      const nextTargetPos = targetList[scrollElementIndex + 1];

      // 计算滚动比例时考虑元素高度
      const sourceDistance = nextSourcePos - currentSourcePos;
      const targetDistance = nextTargetPos - currentTargetPos;

      // 添加最小距离阈值，避免小距离计算导致的跳动
      const MIN_DISTANCE = 10;
      if (sourceDistance < MIN_DISTANCE || targetDistance < MIN_DISTANCE) {
        return;
      }

      // 计算滚动比例
      const ratio = Math.max(
        0,
        Math.min(1, (scrollInfo.scrollTop - currentSourcePos) / sourceDistance),
      );
      requestAnimationFrame(() => {
        targetElement.scrollTop = currentTargetPos + targetDistance * ratio;
      });
    }
  }

  // 编辑区滚动
  handleEditorScroll(editorView: EditorView, previewView: HTMLElement | null) {
    if (previewView) {
      this.computedTop({ previewView, editorView });
      this.handleScroll("editor", { editorView, previewView });
    }
  }

  // 预览区滚动
  handlePreviewScroll(previewView: HTMLElement | null, editorView: EditorView) {
    if (previewView) {
      this.computedTop({ previewView, editorView });
      this.handleScroll("preview", { editorView, previewView });
    }
  }
}

export const scroll = new Scroll();

export const handleEditorScroll = ({ editorView, previewView }: InstancesType) => {
  scroll.handleEditorScroll(editorView, previewView);
};

export const handlePreviewScroll = ({ editorView, previewView }: InstancesType) => {
  scroll.handlePreviewScroll(previewView, editorView);
};
