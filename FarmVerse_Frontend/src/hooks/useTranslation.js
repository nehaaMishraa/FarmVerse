import { useLanguage } from '../contexts/LanguageContext';
import { en } from '../translations/en';
import { hi } from '../translations/hi';

const translations = {
  en,
  hi
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || translations.en[key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };
  
  return { t, language };
};
