import { create } from "zustand";
import { en } from "./en";
import { cn } from "./cn";
import { tw } from "./tw";

type Language = "en" | "cn" | "tw";
const locales = { en, cn, tw } as const;

export type TRANSLATION_KEYS = keyof typeof en;
export type t = {
  t: (key: TRANSLATION_KEYS) => string;
};

interface TranslationStoreType {
  currentLocale: Language;
  t: (key: TRANSLATION_KEYS) => string;
  setLocale: (locale: Language) => void;
}

const DEFAULT_LOCALE: Language = "en";

export const useTranslation = create<TranslationStoreType>((set, get) => ({
  currentLocale: DEFAULT_LOCALE,
  t: (key: TRANSLATION_KEYS) => {
    const currentTranslations = locales[get().currentLocale];
    return currentTranslations[key] || locales.en[key] || key;
  },
  setLocale: (locale: Language) => set({ currentLocale: locale }),
}));

// 翻译函数
export const t = (key: TRANSLATION_KEYS): string => {
  return useTranslation.getState().t(key);
};

// 设置语言函数
export const setLocale = (locale: Language): void => {
  if (locale) {
    useTranslation.getState().setLocale(locale);
  }
  useTranslation.getState().setLocale(locale);
};

// 获取当前语言
export const getCurrentLocale = (): Language => {
  return useTranslation.getState().currentLocale;
};
