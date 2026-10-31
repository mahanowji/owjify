import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { UI_TEXT } from '../data/translations';
import { loc } from '../utils/formatters';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.LANG, 'fa');
    return saved === 'en' ? 'en' : 'fa';
  });

  useEffect(() => {
    const dir = lang === 'fa' ? 'rtl' : 'ltr';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', dir);
      if (typeof document.title === 'string') {
        document.title =
          lang === 'fa'
            ? 'اوجیفای | OWJIFY — بازارگاه خدمات تخصصی'
            : 'OWJIFY — Professional Services Marketplace';
      }
    }
    writeStorage(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next === 'en' ? 'en' : 'fa');
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'fa' ? 'en' : 'fa'));
  }, []);

  const l = useCallback((val) => loc(val, lang), [lang]);

  const value = useMemo(
    () => ({
      lang,
      isRTL: lang === 'fa',
      dir: lang === 'fa' ? 'rtl' : 'ltr',
      setLang,
      setLanguage: setLang,
      toggleLang,
      toggleLanguage: toggleLang,
      l,
      ui: UI_TEXT[lang] || UI_TEXT.fa,
    }),
    [lang, setLang, toggleLang, l]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
