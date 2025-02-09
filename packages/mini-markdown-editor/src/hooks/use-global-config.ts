import { ConfigContext } from "@/components/providers/config-provider";
import { useContext } from "react";

export const useGlobalConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("GlobalConfig init error");
  }
  return context;
};
