/**
 * 此类用于处理编辑器和预览区域的滚动同步
 */
import { EditorView } from "@uiw/react-codemirror";
interface InstancesType {
  previewView: HTMLElement;
  editorView: EditorView;
}

class ScrollSynchronizer {
  // 编辑器和预览区域的高度映射
  private readonly editorElementList: number[] = [];
  private readonly previewElementList: number[] = [];
  // 滚动动画的配置参数
  private static readonly SCROLL_ANIMATION_DURATION = 100; // ms
  private static readonly MIN_SCROLL_DISTANCE = 10; // px
  // 添加底部滚动阈值
  private static readonly BOTTOM_THRESHOLD = 1; // px

  // 计算编辑器和预览区域高度的对应关系
  private computeHeightMapping({ previewView, editorView }: InstancesType): void {
    this.clearHeightMappings();

    const validNodes = this.getValidPreviewNodes(previewView);
    validNodes.forEach((node) => {
      const lineNumber = this.getLineNumber(node);
      if (!this.isValidLineNumber(lineNumber, editorView)) return;

      const editorLineInfo = this.getEditorLineInfo(lineNumber, editorView);
      if (!editorLineInfo) return;

      this.editorElementList.push(editorLineInfo.top);
      this.previewElementList.push((node as HTMLElement).offsetTop);
    });
  }

  // 同步滚动
  private synchronizeScroll(
    source: "editor" | "preview",
    { editorView, previewView }: InstancesType,
  ): void {
    const { scrollElement, targetElement } = this.getScrollElements(
      source,
      editorView,
      previewView,
    );
    if (!scrollElement || !targetElement) return;

    // 顶部边界检查
    if (scrollElement.scrollTop <= 0) {
      targetElement.scrollTop = 0;
      return;
    }

    // 底部边界检查
    if (this.isScrolledToBottom(scrollElement)) {
      this.scrollToBottom(targetElement);
      return;
    }

    this.performProportionalScroll(scrollElement, targetElement, source);
  }

  // 获取有效的预览节点
  private getValidPreviewNodes(previewView: HTMLElement): Element[] {
    return Array.from(previewView.childNodes).filter((node: ChildNode) => {
      const element = node as HTMLElement;
      return !((element.clientHeight === 0 && node.nodeName === "P") || node.nodeType === 3);
    }) as Element[];
  }

  // 获取行号
  private getLineNumber(node: Element): number {
    const lineAttr = node.getAttribute("data-line");
    return lineAttr ? Number(lineAttr) : -1;
  }

  // 判断行号是否有效
  private isValidLineNumber(lineNumber: number, editorView: EditorView): boolean {
    return lineNumber >= 1 && editorView.state?.doc && lineNumber <= editorView.state.doc.lines;
  }

  // 获取编辑器行信息
  private getEditorLineInfo(lineNumber: number, editorView: EditorView) {
    const line = editorView.state?.doc?.line(lineNumber);
    return line ? editorView.lineBlockAt(line.from) : null;
  }

  // 清除高度映射
  private clearHeightMappings(): void {
    this.editorElementList.length = 0;
    this.previewElementList.length = 0;
  }

  // 获取滚动元素
  private getScrollElements(
    source: "editor" | "preview",
    editorView: EditorView,
    previewView: HTMLElement,
  ) {
    const scrollElement = source === "editor" ? editorView.scrollDOM : previewView;
    const targetElement = source === "editor" ? previewView : editorView.scrollDOM;
    return { scrollElement, targetElement };
  }

  // 判断是否滚动到底部
  private isScrolledToBottom(element: Element): boolean {
    return (
      element.scrollTop + element.clientHeight + ScrollSynchronizer.BOTTOM_THRESHOLD >=
      element.scrollHeight
    );
  }

  // 滚动到顶部
  private scrollToTop(editorView: EditorView, previewView: HTMLElement): void {
    editorView.scrollDOM.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    previewView.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // 滚动到底部
  private scrollToBottom(targetElement: Element): void {
    const targetScrollTop = targetElement.scrollHeight - targetElement.clientHeight;
    const currentScrollTop = targetElement.scrollTop;
    const distance = targetScrollTop - currentScrollTop;

    const animate = (timestamp: number, startTime?: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / ScrollSynchronizer.SCROLL_ANIMATION_DURATION, 1);

      targetElement.scrollTop = currentScrollTop + distance * percent;

      if (progress < ScrollSynchronizer.SCROLL_ANIMATION_DURATION) {
        requestAnimationFrame((time) => animate(time, startTime));
      }
    };

    requestAnimationFrame(animate);
  }

  // 比例滚动
  private performProportionalScroll(
    scrollElement: Element,
    targetElement: Element,
    source: "editor" | "preview",
  ): void {
    const sourceList = source === "editor" ? this.editorElementList : this.previewElementList;
    const targetList = source === "editor" ? this.previewElementList : this.editorElementList;

    const scrollIndex = this.findScrollIndex(sourceList, scrollElement.scrollTop);
    if (scrollIndex >= sourceList.length - 1) return;

    const { ratio, targetScrollTop } = this.calculateScrollPosition(
      scrollIndex,
      sourceList,
      targetList,
      scrollElement.scrollTop,
    );

    if (ratio >= 0) {
      requestAnimationFrame(() => {
        targetElement.scrollTop = targetScrollTop;
      });
    }
  }

  // 查找滚动索引
  private findScrollIndex(sourceList: number[], scrollTop: number): number {
    for (let i = 0; i < sourceList.length - 1; i++) {
      if (scrollTop < sourceList[i + 1]) return i;
    }
    return sourceList.length - 1;
  }

  // 计算滚动位置
  //* 该方法的返回滚动比例和目标滚动位置
  private calculateScrollPosition(
    index: number,
    sourceList: number[],
    targetList: number[],
    scrollTop: number,
  ) {
    const sourceDistance = sourceList[index + 1] - sourceList[index];
    const targetDistance = targetList[index + 1] - targetList[index];

    if (
      sourceDistance < ScrollSynchronizer.MIN_SCROLL_DISTANCE ||
      targetDistance < ScrollSynchronizer.MIN_SCROLL_DISTANCE
    ) {
      return { ratio: -1, targetScrollTop: 0 };
    }

    const ratio = Math.max(0, Math.min(1, (scrollTop - sourceList[index]) / sourceDistance));
    let targetScrollTop = targetList[index] + targetDistance * ratio;

    //* 边界修正
    if (targetScrollTop < 0) targetScrollTop = 0; // 顶部边界保护
    const maxScroll = targetList[targetList.length - 1];
    if (targetScrollTop > maxScroll) targetScrollTop = maxScroll; // 底部边界保护

    return { ratio, targetScrollTop };
  }

  // 处理编辑器滚动
  public handleEditorScroll(editorView: EditorView, previewView: HTMLElement | null): void {
    if (!previewView) return;
    this.computeHeightMapping({ previewView, editorView });
    this.synchronizeScroll("editor", { editorView, previewView });
  }

  // 处理预览区滚动
  public handlePreviewScroll(previewView: HTMLElement | null, editorView: EditorView): void {
    if (!previewView) return;
    this.computeHeightMapping({ previewView, editorView });
    this.synchronizeScroll("preview", { editorView, previewView });
  }

  // 处理双区域滚动到顶部
  public handleScrollTop(editorView: EditorView, previewView: HTMLElement): void {
    if (!previewView) return;
    this.computeHeightMapping({ previewView, editorView });
    this.scrollToTop(editorView, previewView);
  }
}

//? 可选导出
const scrollSynchronizer = new ScrollSynchronizer();

export const handleEditorScroll = ({ editorView, previewView }: InstancesType): void => {
  scrollSynchronizer.handleEditorScroll(editorView, previewView);
};

export const handlePreviewScroll = ({ editorView, previewView }: InstancesType): void => {
  scrollSynchronizer.handlePreviewScroll(previewView, editorView);
};

export const handleScrollTop = ({ editorView, previewView }: InstancesType): void => {
  scrollSynchronizer.handleScrollTop(editorView, previewView);
};
