import 'react-i18next'
import translation_en from '../public/locales/en/translation.json'
import translation_zh from '../public/locales/zh/translation.json'

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: 'en'
    // custom resources type
    resources: {
      en: typeof translation_en
      zh: typeof translation_zh
    }
  }
}
