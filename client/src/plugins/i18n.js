import { createI18n } from 'vue-i18n'
import router from '@/router'
import detectInitialLocale from '@/utils/localeHelpers/detectInitialLocale'
import { DEFAULT_LOCALE } from '@/constants/config'
import { messages, datetimeFormats, numberFormats } from '@/config/i18nConfig'

const i18n = createI18n({
	legacy: false,
	locale: detectInitialLocale(router.currentRoute.value),
	fallbackLocale: DEFAULT_LOCALE,
	messages,
	datetimeFormats,
	numberFormats,
	globalInjection: true,
})

export default i18n
