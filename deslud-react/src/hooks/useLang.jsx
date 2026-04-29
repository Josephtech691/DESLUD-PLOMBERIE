// src/hooks/useLang.js
import { createContext, useContext, useState } from 'react';
import { getLang, setLang, t as translate } from '../utils/i18n';

export const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState(getLang());
  const switchLang = (l) => { setLang(l); setLangState(l); };
  const t = (path) => translate(path, lang);
  return <LangContext.Provider value={{ lang, switchLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
