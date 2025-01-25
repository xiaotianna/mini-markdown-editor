import type { ToolbarItem, ToolbarType } from "@/types/toolbar";
import { toolbar } from "./toolbar/base";

class ToolbarConfig {
  private toolbars: ToolbarItem[];

  constructor() {
    this.toolbars = this.initToolbars();
  }

  // 初始化工具栏内容
  private initToolbars(): ToolbarItem[] {
    return toolbar;
  }

  // 获取所有工具栏项
  public getAllToolbars(): ToolbarItem[] {
    return this.toolbars;
  }

  public addToolbar(toolbarItem: ToolbarItem): void {
    this.toolbars.push(toolbarItem);
  }

  public removeToolbar(type: ToolbarType): void {
    const index = this.toolbars.findIndex((toolbar) => toolbar.type === type);
    if (index !== -1) {
      this.toolbars.splice(index, 1);
    }
  }

  public updateToolbar(type: ToolbarType, newConfig: Partial<ToolbarItem>): void {
    const index = this.toolbars.findIndex((toolbar) => toolbar.type === type);
    if (index !== -1) {
      this.toolbars[index] = { ...this.toolbars[index], ...newConfig };
    }
  }

  // TODO: 添加重新排序工具栏顺序（例如拖拽排序？？）的方法
  public reorderToolbars(newOrder: ToolbarType[]): void {
    const toolbarMap = new Map(this.toolbars.map((toolbar) => [toolbar.type, toolbar]));
    this.toolbars = newOrder
      .map((type) => toolbarMap.get(type))
      .filter((toolbar): toolbar is ToolbarItem => toolbar !== undefined);
  }
}

export const toolbarConfig = new ToolbarConfig();
