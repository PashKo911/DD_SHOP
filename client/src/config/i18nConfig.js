import { markRaw } from 'vue'
import UaFlagIcon from '@/components/icons/UaFlagIcon.vue'
import UsaFlagIcon from '@/components/icons/UsaFlagIcon.vue'

import localesEN from '@/locales/en.json'
import localesUA from '@/locales/ua.json'

export const supportedLocales = {
	en: {
		displayCode: 'en',
		label: 'English',
		flag: markRaw(UsaFlagIcon),
		messages: localesEN,
		datetimeFormats: {
			long: { year: 'numeric', month: 'long', day: 'numeric' },
		},
		numberFormat: {
			currency: {
				style: 'currency',
				currency: 'USD',
				currencyDisplay: 'symbol',
			},
		},
	},
	uk: {
		displayCode: 'ua',
		label: 'Українська',
		flag: markRaw(UaFlagIcon),
		messages: localesUA,
		datetimeFormats: {
			long: { year: 'numeric', month: 'long', day: 'numeric' },
		},
		numberFormat: {
			currency: {
				style: 'currency',
				currency: 'UAH',
				currencyDisplay: 'symbol',
			},
		},
	},
}

export const localeCodes = Object.keys(supportedLocales) // ['en','uk']

export const localeRegex = localeCodes.join('|') // 'en|uk'

export const messages = Object.fromEntries(
	localeCodes.map((key) => [key, supportedLocales[key].messages]),
)

export const datetimeFormats = Object.fromEntries(
	localeCodes.map((key) => [key, supportedLocales[key].datetimeFormats]),
)

export const numberFormats = Object.fromEntries(
	localeCodes.map((key) => [key, supportedLocales[key].numberFormat]),
)
