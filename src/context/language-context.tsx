"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('rtl');

  useEffect(() => {
    const newDir = language === 'ar' ? 'rtl' : 'ltr';
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
