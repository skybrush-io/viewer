import config from 'config';

import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { type NestedRecord } from '~/utils/types';

// import * as de from './de.json';
import * as en from './en.json';
// import * as es from './es.json';
// import * as fr from './fr.json';
import * as hu from './hu.json';
// import * as it from './it.json';
import * as ja from './ja.json';
// import * as nl from './nl.json';
// import * as ro from './ro.json';
import * as zhHans from './zh-Hans.json';

const resources: Resource = {
  en: { translation: en },
  hu: { translation: hu },
  'zh-Hans': { translation: zhHans },
  ja: { translation: ja },
};

/* Languages */

type Language = {
  label: string;
  code: string;
  translation: NestedRecord<string>;
};

// Labels (and sorting) based on: https://ux.stackexchange.com/q/37017/165102
const availableLanguages: Language[] = [
  // { label: 'Deutsch', code: 'de', translation: de },
  { label: 'English', code: 'en', translation: en },
  // { label: 'Español', code: 'es', translation: es },
  // { label: 'Français', code: 'fr', translation: fr },
  // { label: 'Italiano', code: 'it', translation: it },
  { label: 'Magyar', code: 'hu', translation: hu },
  // { label: 'Nederlands', code: 'nl', translation: nl },
  // { label: 'Română', code: 'ro', translation: ro },
  { label: '日本語', code: 'ja', translation: ja },
  { label: '中文', code: 'zh-Hans', translation: zhHans },
];

export const enabledLanguages = availableLanguages.filter(({ code }) =>
  config.language.enabled.includes(code)
);

/* Instance */

export const initI18N = async () =>
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,

      lng: config.language.default,
      fallbackLng: config.language.fallback,
      supportedLngs: config.language.enabled,

      debug: true,

      // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
      // if you're using a language detector, do not define the lng option

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });

export default i18n;
