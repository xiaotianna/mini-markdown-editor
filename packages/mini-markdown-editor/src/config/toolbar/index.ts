import type { ToolbarItem, ToolbarType } from "@/types/toolbar";
import { defaultToolbar } from "./base";
import { produce } from "immer";
import { BaseClass } from "../base";

class ToolbarConfig extends BaseClass {
  private toolbars: ToolbarItem[];
  private readonly defaultToolbars: ToolbarItem[];

  constructor(initialToolbars: ToolbarItem[]) {
    super({
      name: "toolbarConfig",
      maxListeners: 10,
    });
    this.defaultToolbars = [...initialToolbars];
    this.toolbars = this.initToolbars();
  }

  // 初始化默认工具栏内容
  private initToolbars(): ToolbarItem[] {
    return [...this.defaultToolbars];
  }

  // 获取所有工具栏项
  public getAllToolbars(): ToolbarItem[] {
    return this.toolbars;
  }

  // 获取指定类型的工具栏项
  private getToolbarByType(type: ToolbarType): ToolbarItem | undefined {
    return this.toolbars.find((toolbar) => toolbar.type === type);
  }

  // 添加指定工具栏项
  public addToolbar(toolbarItem: ToolbarItem): void {
    // 过滤掉重复的工具栏项
    if (this.getToolbarByType(toolbarItem.type)) {
      throw new Error(`Toolbar type ${toolbarItem.type} already exists`);
    }
    this.toolbars = produce(this.toolbars, (draft) => {
      draft.push(toolbarItem);
    });
  }

  // 移除指定工具栏项
  public removeToolbar(type: ToolbarType): void {
    this.toolbars = produce(this.toolbars, (draft) => {
      const index = draft.findIndex((toolbar) => toolbar.type === type);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  }

  // 更新工具栏
  public updateToolbar(type: ToolbarType, newConfig: Partial<ToolbarItem>): void {
    this.toolbars = produce(this.toolbars, (draft) => {
      const index = draft.findIndex((toolbar) => toolbar.type === type);
      if (index !== -1) {
        draft[index] = { ...draft[index], ...newConfig };
      }
    });
  }

  // TODO: 添加重新排序工具栏顺序（例如拖拽排序？？）的方法
  public reorderToolbars(newOrder: ToolbarType[]): void {
    const toolbarMap = new Map(this.toolbars.map((toolbar) => [toolbar.type, toolbar]));
    this.toolbars = produce(this.toolbars, () =>
      newOrder
        .map((type) => toolbarMap.get(type))
        .filter((toolbar): toolbar is ToolbarItem => toolbar !== undefined),
    );
  }

  public reset(): void {
    this.toolbars = this.initToolbars();
  }

  public enableToolbar(type: ToolbarType): void {
    this.updateToolbar(type, { disabled: false });
  }

  public disableToolbar(type: ToolbarType): void {
    this.updateToolbar(type, { disabled: true });
  }
}

export const toolbarConfig = new ToolbarConfig(defaultToolbar);
