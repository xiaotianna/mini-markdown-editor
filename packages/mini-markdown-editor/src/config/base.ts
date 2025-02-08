import { EventEmitter } from "events";

export interface EventCallback {
  (...args: any[]): void;
}

interface BaseConfig {
  name?: string;
  // 最大监听器数量
  maxListeners?: number;
}

export abstract class BaseClass {
  protected readonly config: BaseConfig;
  protected readonly eventEmitter: EventEmitter;
  protected readonly logger: Console;
  protected isDestroyed: boolean = false;

  constructor(config: BaseConfig = {}) {
    this.config = {
      ...config,
    };

    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(this.config.maxListeners!);
    this.logger = console;
  }

  // 错误日志
  protected error(...args: unknown[]): void {
    this.logger.error(`[${this.config.name}]`, ...args);
  }

  /**
   * 添加事件监听器
   * @param event 事件名称
   * @param listener 监听器回调函数
   */
  public on(event: string, listener: EventCallback): void {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }
    this.eventEmitter.on(event, listener);
  }

  /**
   * 一次性事件监听器
   * @param event 事件名称
   * @param listener 监听器回调函数
   */
  public once(event: string, listener: EventCallback): void {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }
    this.eventEmitter.once(event, listener);
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param listener 监听器回调函数
   */
  public off(event: string, listener: EventCallback): void {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }
    this.eventEmitter.off(event, listener);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  protected emit(event: string, ...args: unknown[]): void {
    this.eventEmitter.emit(event, ...args);
  }

  public isDestroy(): boolean {
    return this.isDestroyed;
  }

  /**
   * 获取当前注册的所有事件
   */
  public getEvents(): string[] {
    return this.eventEmitter.eventNames() as string[];
  }

  /**
   * 获取特定事件的监听器数量
   * @param event 事件名称
   */
  public listenerCount(event: string): number {
    return this.eventEmitter.listenerCount(event);
  }

  // 销毁实例
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    try {
      // 触发销毁前事件
      this.emit("beforeDestroy");

      // 移除所有事件监听器
      this.eventEmitter.removeAllListeners();

      // 标记为已销毁
      this.isDestroyed = true;

      // 触发销毁完成事件
      this.emit("destroyed");
    } catch (error) {
      this.error("Error during destruction:", error);
    }
  }

  protected checkDestroyed(): void {
    if (this.isDestroyed) {
      this.logger.error("ERROR ISDESTOYED");
      // TODO: 后续操作
    }
  }
}
