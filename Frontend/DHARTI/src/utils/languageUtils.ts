import i18n from '../i18n/i18n';

export const switchLanguage = (lang: 'en' | 'hi' | 'gu' | 'te' | 'ta') => {
  i18n.changeLanguage(lang);
};