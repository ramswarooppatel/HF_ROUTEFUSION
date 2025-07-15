import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import gu from '../locales/gu.json';
import te from '../locales/te.json';
import ta from '../locales/ta.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    gu: { translation: gu },
    te: { translation: te },
    ta: { translation: ta }
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  supportedLngs: ['en', 'hi', 'gu', 'te', 'ta']
});

export default i18n;