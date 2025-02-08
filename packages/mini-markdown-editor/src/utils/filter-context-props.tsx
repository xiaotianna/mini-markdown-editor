import { GlobalConfig, GlobalContextConfig } from "@/types/global-config";

export const filterContextProps = (
  context: Partial<GlobalConfig>,
  props: GlobalConfig,
): Omit<GlobalConfig, keyof GlobalContextConfig> => {
  // 1. 获取 context 的所有键和固定要过滤的键
  const contextKeys = new Set([...Object.keys(context), "isSyncScroll"]);

  // 2. 从 props 中解构出固定要保留的属性
  const { className, style, ...restProps } = props;

  // 3. 创建新对象，过滤掉 context 的属性和 isSync
  const filteredProps = Object.fromEntries(
    Object.entries(restProps).filter(([key]) => !contextKeys.has(key)),
  );

  return {
    ...filteredProps,
    className,
    style,
  } as Omit<GlobalConfig, keyof GlobalContextConfig>;
};
