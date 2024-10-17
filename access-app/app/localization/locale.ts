import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js'
import { translations } from './translations';

export const i18n = new I18n(translations)
i18n.locale = Localization.getLocales()[0].languageCode
i18n.enableFallback = true
i18n.defaultLocale = "en"


