import { GlobalConfig, GlobalContextConfig } from "@/types/global-config";

export const filterContextProps = (
  context: Partial<GlobalConfig>,
  props: GlobalConfig,
): Omit<GlobalConfig, keyof GlobalContextConfig> => {
  // 获取 context 的所有键和固定要过滤的键
  const contextKeys = new Set([...Object.keys(context), "isSyncScroll"]);

  const { className, style, ...restProps } = props;

  const filteredProps = Object.fromEntries(
    Object.entries(restProps).filter(([key]) => !contextKeys.has(key)),
  );

  return {
    ...filteredProps,
    className,
    style,
  } as Omit<GlobalConfig, keyof GlobalContextConfig>;
};
