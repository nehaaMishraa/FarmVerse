import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <button
      className="btn btn-outline-light btn-sm"
      onClick={toggleLanguage}
      title={language === 'en' ? t('switchToHindi') : t('switchToEnglish')}
      style={{ 
        minWidth: '60px',
        fontSize: '0.9rem',
        fontWeight: '600'
      }}
    >
      {language === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
