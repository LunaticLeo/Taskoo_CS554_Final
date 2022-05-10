import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import cn from './zh-cn.json';
import en from './en-us.json';

const resources = {
	cn: { translation: cn },
	en: { translation: en }
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		detection: {
			caches: ['localStorage', 'cookie']
		}
	});

export default i18n;
