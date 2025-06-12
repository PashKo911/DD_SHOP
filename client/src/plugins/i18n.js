import { createI18n } from 'vue-i18n'
import localesEN from '@/locales/en.json'
import localesUA from '@/locales/ua.json'

const i18n = createI18n({
	legacy: false,
	locale:
		localStorage.getItem('lastLocale') ||
		import.meta.env.VITE_I18N_LOCALE ||
		'en',
	fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
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
	numberFormats: {
		en: {
			currency: {
				style: 'currency',
				currency: 'USD',
				currencyDisplay: 'symbol',
			},
		},
		uk: {
			currency: {
				style: 'currency',
				currency: 'UAH',
				currencyDisplay: 'symbol',
			},
		},
	},
	globalInjection: true,
})

export default i18n
