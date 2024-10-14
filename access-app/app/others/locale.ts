import i18n from 'i18next';
import { initReactI18next, Trans } from 'react-i18next';
import { getLocales } from "react-native-localize";

export const deviceLanguage = getLocales()[0].languageCode;

const resources = {
    en: {
        translation: {
            LoginGreetingH1: 'Hello 👋',
            LoginGreetingH2: 'Please sign in:',
            LoginButton: 'Sign In',
            LoginUsernamePlaceholder: 'Username',
            LoginPasswordPlaceholder: 'Password',
        },
    },
    ro: {
        translation: {
            LoginGreetingH1: 'Salut 👋',
            LoginGreetingH2: 'Te rog să te autentifici:',
            LoginButton: 'Autentifică-te',
            LoginUsernamePlaceholder: 'Nume de utilizator',
            LoginPasswordPlaceholder: 'Parolă',
        }
    }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;