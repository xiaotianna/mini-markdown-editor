import React, { createContext, useState, useContext, ReactNode } from "react";
import { en } from "./en";
import { cn } from "./cn";

type Language = "en" | "cn";
type LocaleMessages = typeof en;

interface LocaleContextType {
  locale: Language;
  messages: LocaleMessages;
  changeLocale: (locale: Language) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// 语言包映射
const locales: Record<Language, LocaleMessages> = {
  en,
  cn,
};

export const LocaleProvider: React.FC<{
  children: ReactNode;
  localeConfig?: Language;
}> = ({ children, localeConfig = "cn" }) => {
  const [locale, setLocale] = useState<Language>(localeConfig);

  //? 提供切换语言
  const changeLocale = (newLocale: Language) => {
    setLocale(newLocale);
  };

  const value = {
    locale,
    messages: locales[locale],
    changeLocale,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("Locale init error");
  }
  return context;
};
