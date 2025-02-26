import type { ToolbarItem, ToolbarType } from "@/types/toolbar";
import { defaultToolbar } from "./base";
import { produce } from "immer";
import { BaseClass } from "../base";
import { ToolbarEvents } from "@/types/toolbar";

class ToolbarConfig extends BaseClass {
  private toolbars: ToolbarItem[];
  private readonly defaultToolbars: ToolbarItem[];
  private toolbarOrderMap: Map<ToolbarType, number>;
  private initialized: boolean = false;
  private plugins: Map<string, (...args: any[]) => any> = new Map();

  constructor(initialToolbars: ToolbarItem[]) {
    super({
      name: "toolbarConfig",
      maxListeners: 10,
    });
    this.toolbarOrderMap = new Map();
    this.defaultToolbars = [...initialToolbars];
    this.toolbars = this.initToolbar();
    this.initToolbarOrderMap();
    this.initialized = true;
    this.emit(ToolbarEvents.TOOLBAR_RESET, this.toolbars);
  }

  // ---------------------初始化函数-----------------------

  // 初始化默认工具栏内容
  private initToolbar(): ToolbarItem[] {
    return [...this.defaultToolbars];
  }

  // 初始化顺序映射
  private initToolbarOrderMap(): void {
    this.toolbars.forEach((toolbar, index) => {
      this.toolbarOrderMap.set(toolbar.type, index);
    });
  }

  // ---------------------获取（get）函数-----------------------

  // 获取默认工具栏内容
  public getDefaultToolbar(): ToolbarItem[] {
    return this.defaultToolbars;
  }

  // 获取工具项的当前顺序
  public getToolbarOrder(type: ToolbarType): number {
    const order = this.toolbarOrderMap.get(type);
    return order !== undefined ? order : -1;
  }

  // 获取所有工具栏顺序
  public getAllToolbarsOrder(): { type: ToolbarType; order: number }[] {
    try {
      this.checkDestroyed();

      return Array.from(this.toolbarOrderMap.entries())
        .map(([type, order]) => ({
          type,
          order,
        }))
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      this.error("Error getting toolbars order:", error);
      throw error;
    }
  }

  // 获取所有工具栏项
  public getAllToolbars(): ToolbarItem[] {
    return this.toolbars;
  }

  // 获取指定类型的工具栏项
  private getToolbarByType(type: ToolbarType): ToolbarItem | undefined {
    return this.toolbars.find((toolbar) => toolbar.type === type);
  }

  // ---------------------验证/校验函数-----------------------

  // 验证顺序的有效性
  private validateOrder(order: number): number {
    const maxOrder = this.toolbars.length - 1;
    return Math.max(0, Math.min(order, maxOrder));
  }

  // ---------------------操作（工具）函数-----------------------

  // 添加工具项方法
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

      this.toolbarOrderMap.set(toolbarItem.type, this.toolbars.length - 1);

      this.emit(ToolbarEvents.TOOLBAR_ADDED, toolbarItem);
    } catch (error) {
      this.error("Error adding toolbar:", error);
      throw error;
    }
  }

  // 设置单个工具项的顺序
  public setToolbarOrder(type: ToolbarType, newOrder: number): void {
    try {
      this.checkDestroyed();

      const toolbar = this.getToolbarByType(type);
      if (!toolbar) {
        throw new Error(`Toolbar type ${type} does not exist`);
      }

      const currentOrder = this.getToolbarOrder(type);
      const validOrder = this.validateOrder(newOrder);

      if (currentOrder === validOrder) return;

      this.toolbars = produce(this.toolbars, (draft) => {
        const item = draft.splice(currentOrder, 1)[0];
        draft.splice(validOrder, 0, item);
      });

      this.initToolbarOrderMap();

      this.emit(ToolbarEvents.TOOLBAR_REORDERED, this.toolbars);
    } catch (error) {
      this.error("Error setting toolbar order:", error);
      throw error;
    }
  }

  // 批量设置工具项顺序
  public setToolbarsOrder(orders: Record<ToolbarType, number>): void {
    try {
      this.checkDestroyed();

      const sortedItems = [...this.toolbars];
      const processedTypes = new Set<ToolbarType>();

      // 遍历所有工具项，按照传入的顺序进行排序
      Object.entries(orders).forEach(([type, order]) => {
        const toolbarType = type as ToolbarType;
        const validOrder = this.validateOrder(order);
        const currentIndex = sortedItems.findIndex((item) => item.type === toolbarType);

        if (currentIndex !== -1) {
          const [item] = sortedItems.splice(currentIndex, 1);
          sortedItems.splice(validOrder, 0, item);
          processedTypes.add(toolbarType);
        }
      });

      this.updateToolbars(sortedItems);
      this.initToolbarOrderMap();

      this.emit(ToolbarEvents.TOOLBAR_REORDERED, this.toolbars);
    } catch (error) {
      this.error("Error setting toolbars order:", error);
      throw error;
    }
  }

  // 移除指定工具栏项
  public removeToolItem(type: ToolbarType): void {
    try {
      this.checkDestroyed();

      const toolbarToRemove = this.getToolbarByType(type);
      if (!toolbarToRemove) return;

      const removedOrder = this.getToolbarOrder(type);

      this.toolbars = produce(this.toolbars, (draft) => {
        const index = draft.findIndex((toolbar) => toolbar.type === type);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      });

      this.toolbarOrderMap.delete(type);
      this.toolbars.forEach((toolbar) => {
        const currentOrder = this.toolbarOrderMap.get(toolbar.type);
        if (currentOrder !== undefined && currentOrder > removedOrder) {
          this.toolbarOrderMap.set(toolbar.type, currentOrder - 1);
        }
      });

      this.emit(ToolbarEvents.TOOLBAR_REMOVED, type);
    } catch (error) {
      this.error("Error removing toolbar:", error);
      throw error;
    }
  }

  // 更新工具栏内容
  public updateToolbars(newToolbars: ToolbarItem[]) {
    this.toolbars = newToolbars;
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

  // 重置工具栏顺序
  public reset(): void {
    this.toolbars = this.initToolbar();
    this.initToolbarOrderMap();
    this.emit(ToolbarEvents.TOOLBAR_RESET, this.toolbars);
  }

  // 工具栏顺序重排序
  public reorderToolbar(newOrder: ToolbarType[]): void {
    try {
      this.checkDestroyed();

      // 验证新顺序是否包含所有现有工具项
      const currentTypes = new Set(this.toolbars.map((t) => t.type));
      const newTypes = new Set(newOrder);

      if (currentTypes.size !== newTypes.size) {
        throw new Error("New order must include all existing toolbar items");
      }

      currentTypes.forEach((type) => {
        if (!newTypes.has(type)) {
          throw new Error(`Missing toolbar type: ${type}`);
        }
      });

      const toolbarMap = new Map(this.toolbars.map((toolbar) => [toolbar.type, toolbar]));
      this.toolbars = produce(this.toolbars, () =>
        newOrder
          .map((type) => toolbarMap.get(type))
          .filter((toolbar): toolbar is ToolbarItem => toolbar !== undefined),
      );

      this.initToolbarOrderMap();

      this.emit(ToolbarEvents.TOOLBAR_REORDERED, this.toolbars);
    } catch (error) {
      this.error("Error reordering toolbars:", error);
      throw error;
    }
  }

  // 交换工具栏位置（一对一）
  public swapToolbarsPosition(firstType: ToolbarType, secondType: ToolbarType): void {
    try {
      this.checkDestroyed();

      const firstIndex = this.toolbars.findIndex((t) => t.type === firstType);
      const secondIndex = this.toolbars.findIndex((t) => t.type === secondType);

      // 验证工具是否存在
      if (firstIndex === -1) {
        throw new Error(`Toolbar type ${firstType} does not exist`);
      }
      if (secondIndex === -1) {
        throw new Error(`Toolbar type ${secondType} does not exist`);
      }

      if (firstIndex === secondIndex) {
        return;
      }

      this.toolbars = produce(this.toolbars, (draft) => {
        [draft[firstIndex], draft[secondIndex]] = [draft[secondIndex], draft[firstIndex]];
      });

      this.initToolbarOrderMap();

      this.emit(ToolbarEvents.TOOLBAR_REORDERED, this.toolbars);
    } catch (error) {
      this.error("Error swapping toolbar positions:", error);
      throw error;
    }
  }

  // ---------------------扩展函数-----------------------

  // 注册方法
  public registerMethod(
    name: string,
    method: (...args: any[]) => any,
    override: boolean = false,
  ): void {
    try {
      this.checkDestroyed();

      // 防止覆盖
      const protectedMethods = [
        "addToolItem",
        "removeToolItem",
        "updateToolbars",
        "reset",
        "registerMethod",
        "unregisterMethod",
        "callMethod",
        "destroy",
      ];

      if (protectedMethods.includes(name)) {
        throw new Error(`Cannot override protected method: ${name}`);
      }

      if (this.plugins.has(name) && !override) {
        throw new Error(`Method "${name}" already exists. Set override to true to replace it.`);
      }

      // 注册
      this.plugins.set(name, method.bind(this));
      this.emit(ToolbarEvents.METHOD_REGISTERED, name);
    } catch (error) {
      this.error("Error registering method:", error);
      throw error;
    }
  }

  // 注销方法
  public unregisterMethod(name: string): void {
    try {
      this.checkDestroyed();

      if (!this.plugins.has(name)) {
        return;
      }

      this.plugins.delete(name);
      this.emit(ToolbarEvents.METHOD_UNREGISTERED, name);
    } catch (error) {
      this.error("Error unregistering method:", error);
      throw error;
    }
  }

  // 调用自定义方法
  public callMethod(name: string, ...args: any[]): any {
    try {
      this.checkDestroyed();

      if (!this.plugins.has(name)) {
        throw new Error(`Method "${name}" not found`);
      }

      return this.plugins.get(name)!(...args);
    } catch (error) {
      this.error(`Error calling method "${name}":`, error);
      throw error;
    }
  }

  // 销毁
  public destroy(): void {
    this.plugins.clear();
    super.destroy();
  }
}

export const toolbarConfig = new ToolbarConfig(defaultToolbar);
