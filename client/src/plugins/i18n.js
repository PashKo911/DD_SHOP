import { createI18n } from 'vue-i18n'
import router from '@/router'
import detectInitialLocale from '@/utils/localeHelpers/detectInitialLocale'

import {
	defaultLocale,
	messages,
	datetimeFormats,
	numberFormats,
} from '@/config/i18nConfig'

const i18n = createI18n({
	legacy: false,
	locale: detectInitialLocale(router.currentRoute.value),
	fallbackLocale: defaultLocale,
	messages,
	datetimeFormats,
	numberFormats,
	globalInjection: true,
})

export default i18n
