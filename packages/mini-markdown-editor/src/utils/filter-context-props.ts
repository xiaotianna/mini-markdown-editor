import { defaultGlobalConfig } from "@/config/global";
import { GlobalConfig, GlobalContextConfig } from "@/types/global-config";

type GlobalContextKeys = keyof GlobalContextConfig | "isSyncScroll";

export const filterContextProps = (props: GlobalConfig): Omit<GlobalConfig, GlobalContextKeys> => {
  // 快速查找
  const contextKeys = new Set<GlobalContextKeys>(
    Object.keys(defaultGlobalConfig) as Array<GlobalContextKeys>,
  );

  contextKeys.add("isSyncScroll" as GlobalContextKeys);

  const { className, style, ...restProps } = props;

  const filteredProps = Object.fromEntries(
    Object.entries(restProps).filter(([key]) => !contextKeys.has(key as GlobalContextKeys)),
  );

  return {
    ...filteredProps,
    className,
    style,
  } as Omit<GlobalConfig, GlobalContextKeys>;
};
