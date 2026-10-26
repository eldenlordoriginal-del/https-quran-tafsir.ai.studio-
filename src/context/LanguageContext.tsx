import React, { createContext, useContext, useState, useEffect } from "react";
import { AppLanguage } from "../types";
import { getTranslation } from "../utils/translations";

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const LANGUAGE_STORAGE_KEY = "quran_app_language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "en" || saved === "ar" || saved === "fa" || saved === "id") return saved;
    } catch {}
    return "en";
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  };

  const isRTL = language === "ar" || language === "fa";
  const dir = isRTL ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: string, fallback?: string): string => {
    return getTranslation(key, language, fallback);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
