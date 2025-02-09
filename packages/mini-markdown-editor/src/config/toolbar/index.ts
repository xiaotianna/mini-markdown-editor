import type { ToolbarItem, ToolbarType } from "@/types/toolbar";
import { defaultToolbar } from "./base";
import { produce } from "immer";
import { BaseClass } from "../base";
import { ToolbarEvents } from "@/types/toolbar";

class ToolbarConfig extends BaseClass {
  private toolbars: ToolbarItem[];
  private readonly defaultToolbars: ToolbarItem[];
  private initialized: boolean = false;

  constructor(initialToolbars: ToolbarItem[]) {
    super({
      name: "toolbarConfig",
      maxListeners: 10,
    });
    this.defaultToolbars = [...initialToolbars];
    this.toolbars = this.initToolbar();
    this.initialized = true;
    this.emit(ToolbarEvents.TOOLBAR_RESET, this.toolbars);
  }

  // 初始化默认工具栏内容
  private initToolbar(): ToolbarItem[] {
    return [...this.defaultToolbars];
  }

  // 获取默认工具栏内容
  public getDefaultToolbar(): ToolbarItem[] {
    return this.defaultToolbars;
  }

  // 更新工具栏内容
  public updateToolbars(newToolbars: ToolbarItem[]) {
    this.toolbars = newToolbars;
  }

  // 获取所有工具栏项
  public getAllToolbars(): ToolbarItem[] {
    return this.toolbars;
  }

  // 获取指定类型的工具栏项
  private getToolbarByType(type: ToolbarType): ToolbarItem | undefined {
    return this.toolbars.find((toolbar) => toolbar.type === type);
  }

  // 修改特定工具栏项的功能
  public updateToolbarItem(type: ToolbarType, partialToolbarItem: Partial<ToolbarItem>): void {
    try {
      this.checkDestroyed();

      const existingToolbar = this.getToolbarByType(type);
      if (!existingToolbar) {
        const error = `Toolbar type ${type} does not exist`;
        this.emit(ToolbarEvents.TOOLBAR_ERROR, error);
        throw new Error(error);
      }

      // 合并现有配置和新配置，保证未提及的项使用默认值
      const updatedToolbar: ToolbarItem = {
        ...existingToolbar,
        ...partialToolbarItem,
        type: existingToolbar.type,
      };

      this.toolbars = produce(this.toolbars, (draft) => {
        const index = draft.findIndex((toolbar) => toolbar.type === type);
        if (index !== -1) {
          draft[index] = updatedToolbar;
        }
      });

      this.emit(ToolbarEvents.TOOLBAR_UPDATED, updatedToolbar);
    } catch (error) {
      this.error("Error updating toolbar:", error);
      throw error;
    }
  }

  // 添加指定工具栏项
  public addToolItem(toolbarItem: ToolbarItem): void {
    try {
      this.checkDestroyed();

      if (!this.initialized) {
        throw new Error("ToolbarConfig is not initialized yet");
      }

      if (this.getToolbarByType(toolbarItem.type)) {
        const error = `Toolbar type ${toolbarItem.type} already exists`;
        this.emit(ToolbarEvents.TOOLBAR_ERROR, error);
        throw new Error(error);
      }

      this.toolbars = produce(this.toolbars, (draft) => {
        draft.push(toolbarItem);
      });

      // 发送工具栏添加事件
      this.emit(ToolbarEvents.TOOLBAR_ADDED, toolbarItem);
    } catch (error) {
      this.error("Error adding toolbar:", error);
      throw error;
    }
  }

  // 移除指定工具栏项
  public removeToolItem(type: ToolbarType): void {
    try {
      this.checkDestroyed();

      const toolbarToRemove = this.getToolbarByType(type);
      if (!toolbarToRemove) return;

      this.toolbars = produce(this.toolbars, (draft) => {
        const index = draft.findIndex((toolbar) => toolbar.type === type);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      });

      this.emit(ToolbarEvents.TOOLBAR_REMOVED, type);
    } catch (error) {
      this.error("Error removing toolbar:", error);
      throw error;
    }
  }

  // 重置工具栏内容
  public reset(): void {
    this.toolbars = this.initToolbar();
  }

  // TODO: 添加重新排序工具栏顺序（例如拖拽排序？？）的方法
  public reorderToolbar(newOrder: ToolbarType[]): void {
    try {
      this.checkDestroyed();

      const toolbarMap = new Map(this.toolbars.map((toolbar) => [toolbar.type, toolbar]));
      this.toolbars = produce(this.toolbars, () =>
        newOrder
          .map((type) => toolbarMap.get(type))
          .filter((toolbar): toolbar is ToolbarItem => toolbar !== undefined),
      );

      this.emit(ToolbarEvents.TOOLBAR_REORDERED, this.toolbars);
    } catch (error) {
      this.error("Error reordering toolbars:", error);
      throw error;
    }
  }
}

export const toolbarConfig = new ToolbarConfig(defaultToolbar);
