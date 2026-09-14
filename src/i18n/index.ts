import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en.json';
import ar from './translations/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

export const initI18n = async () => {
  try {
    const savedLang = await AsyncStorage.getItem("user-language");
    const locales = Localization.getLocales();
    const deviceLanguage = locales && locales.length > 0 ? locales[0].languageTag : 'en-US';
    
    // If user has a saved language, use it, else use device language
    const langToUse = savedLang ? savedLang : (deviceLanguage.startsWith('ar') ? 'ar' : 'en');

    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: langToUse, 
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        showSupportNotice: false,
      });
  } catch (error) {
    console.error("i18n initialization error", error);
  }
};

export default i18n;
