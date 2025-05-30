import { createI18n } from 'vue-i18n'
import localesEN from '@/locales/en.json'
import localesUA from '@/locales/ua.json'

const i18n = createI18n({
	legacy: false,
	locale:
		localStorage.getItem('lastLocale') ||
		import.meta.env.VITE_I18N_LOCALE ||
		'uk',
	fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'uk',
	messages: {
		en: localesEN,
		uk: localesUA,
	},
	datetimeFormats: {
		en: {
			long: {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			},
		},
		uk: {
			long: {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			},
		},
	},
	globalInjection: true,
})

export default i18n
