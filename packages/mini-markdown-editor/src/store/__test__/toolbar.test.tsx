import { describe, test, expect } from "vitest";
import { useToolbarStore } from "../toolbar";

// 创建独立的 store 实例用于测试
const useTestStore = useToolbarStore;

// 模拟 React 组件
const MockComponent = <div>Sidebar</div>;

describe("useToolbarStore Store测试", () => {
  // 每次测试前重置状态
  beforeEach(() => {
    useTestStore.setState({
      isFullScreen: false,
      isOnlyWrite: false,
      isOnlyPreview: false,
      isSidebar: false,
      sidebarComponent: null,
      componentMark: null,
    });
  });

  test("初始状态应为默认值", () => {
    const state = useTestStore.getState();

    expect(state.isFullScreen).toBe(false);
    expect(state.isOnlyWrite).toBe(false);
    expect(state.isOnlyPreview).toBe(false);
    expect(state.isSidebar).toBe(false);
    expect(state.sidebarComponent).toBeNull();
    expect(state.componentMark).toBeNull();
  });

  describe("全屏状态", () => {
    test("应正确切换全屏状态", () => {
      useTestStore.getState().setIsFullScreen(true);
      expect(useTestStore.getState().isFullScreen).toBe(true);

      useTestStore.getState().setIsFullScreen(false);
      expect(useTestStore.getState().isFullScreen).toBe(false);
    });
  });

  describe("编辑/预览模式", () => {
    test("setIsOnlyWrite 应切换仅编辑状态并关闭预览", () => {
      // 初始状态
      useTestStore.setState({ isOnlyPreview: true });

      // 第一次切换
      useTestStore.getState().setIsOnlyWrite();
      expect(useTestStore.getState().isOnlyWrite).toBe(true);
      expect(useTestStore.getState().isOnlyPreview).toBe(false);

      // 再次切换
      useTestStore.getState().setIsOnlyWrite();
      expect(useTestStore.getState().isOnlyWrite).toBe(false);
    });

    test("setIsOnlyPreview 应切换仅预览状态并关闭编辑", () => {
      // 初始状态
      useTestStore.setState({ isOnlyWrite: true });

      // 第一次切换
      useTestStore.getState().setIsOnlyPreview();
      expect(useTestStore.getState().isOnlyPreview).toBe(true);
      expect(useTestStore.getState().isOnlyWrite).toBe(false);

      // 再次切换
      useTestStore.getState().setIsOnlyPreview();
      expect(useTestStore.getState().isOnlyPreview).toBe(false);
    });
  });

  describe("侧边栏控制", () => {
    test("设置相同标记应切换显示状态", () => {
      const mark = "settings";

      // 第一次设置
      useTestStore.getState().setSidebar(MockComponent, mark);
      expect(useTestStore.getState().isSidebar).toBe(true);
      expect(useTestStore.getState().componentMark).toBe(mark);

      // 相同标记再次设置
      useTestStore.getState().setSidebar(MockComponent, mark);
      expect(useTestStore.getState().isSidebar).toBe(false);
    });

    test("设置不同标记应更新组件", () => {
      // 初始设置
      useTestStore.getState().setSidebar(MockComponent, "settings");

      // 设置不同标记
      useTestStore.getState().setSidebar(<div>New</div>, "help");
      expect(useTestStore.getState().isSidebar).toBe(true);
      expect(useTestStore.getState().componentMark).toBe("help");
    });
  });

  describe("状态互斥测试", () => {
    test("全屏模式不应影响其他状态", () => {
      useTestStore.getState().setIsFullScreen(true);
      useTestStore.getState().setIsOnlyWrite();
      useTestStore.getState().setSidebar(MockComponent, "test");

      const state = useTestStore.getState();
      expect(state.isFullScreen).toBe(true);
      expect(state.isOnlyWrite).toBe(true);
      expect(state.isSidebar).toBe(true);
    });

    test("仅写和仅预览应互斥", () => {
      useTestStore.getState().setIsOnlyWrite();
      expect(useTestStore.getState().isOnlyPreview).toBe(false);

      useTestStore.getState().setIsOnlyPreview();
      expect(useTestStore.getState().isOnlyWrite).toBe(false);
      expect(useTestStore.getState().isOnlyPreview).toBe(true);
    });
  });
});
