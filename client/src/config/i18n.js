import { markRaw } from 'vue'
import { currencies } from '@/constants/currencies'
import UaFlagIcon from '@/components/icons/UaFlagIcon.vue'
import UsaFlagIcon from '@/components/icons/UsaFlagIcon.vue'

import localesEN from '@/locales/en.json'
import localesUA from '@/locales/ua.json'

const defaultLocale = 'en'

const supportedLocales = {
	en: {
		displayCode: 'en',
		label: 'English',
		flag: markRaw(UsaFlagIcon),
		messages: localesEN,
		datetimeFormats: {
			long: { year: 'numeric', month: 'long', day: 'numeric' },
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
	},
}

const localeCodes = Object.keys(supportedLocales) // ['en','uk']
const localeRegex = localeCodes.join('|') // 'en|uk'
const messages = Object.fromEntries(
	localeCodes.map((key) => [key, supportedLocales[key].messages]),
)

const datetimeFormats = Object.fromEntries(
	localeCodes.map((key) => [key, supportedLocales[key].datetimeFormats]),
)

const numberFormats = Object.fromEntries(
	currencies.map((c) => [
		c.locale,
		{
			currency: {
				style: 'currency',
				currency: c.code,
				currencyDisplay: 'narrowSymbol',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			},
		},
	]),
)

export const i18nConfig = Object.freeze({
	legacy: false,
	locale: defaultLocale,
	fallbackLocale: defaultLocale,
	messages,
	datetimeFormats,
	numberFormats,
	globalInjection: true,
})

export const i18nMeta = Object.freeze({
	defaultLocale,
	supportedLocales,
	localeCodes,
	localeRegex,
})
