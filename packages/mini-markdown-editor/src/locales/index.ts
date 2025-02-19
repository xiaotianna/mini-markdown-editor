import { en } from "./en";
import { cn } from "./cn";

type Language = "en" | "cn";
const locales = { en, cn } as const;

export type TRANSLATION_KEYS = keyof typeof en;

// 创建翻译器
//? 可以进行优化
export const createTranslator = (locale: Language = "en") => {
  const currentTranslations = locales[locale] || locales.en;

  return (key: TRANSLATION_KEYS) => currentTranslations[key] || locales.en[key] || key;
};
