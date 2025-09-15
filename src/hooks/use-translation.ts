"use client";

import { useLanguage } from './use-language';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

const translations = {
  en,
  ar,
};

type NestedObject = { [key: string]: string | NestedObject };

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: string | NestedObject | undefined = translations[language];

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = result[k as keyof typeof result];
      } else {
        return key; // Return the key itself if not found
      }
    }

    return typeof result === 'string' ? result : key;
  };

  return { t };
};
