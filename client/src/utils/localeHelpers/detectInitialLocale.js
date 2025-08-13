import { localeCodes, defaultLocale } from '@/config/i18nConfig'

function detectInitialLocale(route) {
	const urlLocale = route?.params?.locale
	const storageLocale = localStorage.getItem('lastLocale')

	return localeCodes.includes(urlLocale)
		? urlLocale
		: storageLocale || defaultLocale
}

export default detectInitialLocale
