import { en } from "./en";
import { cn } from "./cn";

export type Language = "en" | "cn";
type LocaleMessages = typeof en;

const locales: Record<Language, LocaleMessages> = {
  en,
  cn,
};

let currentLocale: Language = "cn";

// 设置当前语言
export const setCurrentLocale = (locale: Language | undefined) => {
  if (locale) {
    currentLocale = locale;
  }
};

// 获取当前语言
export const getCurrentLocale = (): Language => {
  return currentLocale;
};

// 翻译工具函数
export const t = (path: string, locale?: Language): string => {
  const targetLocale = locale || currentLocale;
  const messages = locales[targetLocale];

  return path.split(".").reduce((obj, key) => obj?.[key], messages as any) || path;
};

// 获取特定语言的配置
export const getLocaleConfig = <T>(config: T, locale?: Language): T => {
  // 获取目标语言
  const targetLocale = locale || currentLocale;

  //* 递归翻译对象
  const translateObject = (obj: any): any => {
    if (typeof obj === "string") {
      return t(obj, targetLocale);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => translateObject(item));
    }

    if (typeof obj === "object" && obj !== null) {
      const result: any = {};
      for (const key in obj) {
        result[key] = translateObject(obj[key]);
      }
      return result;
    }

    return obj;
  };

  return translateObject(config);
};
