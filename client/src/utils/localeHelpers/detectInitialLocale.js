import { localeCodes } from '@/config/i18nConfig'
import { DEFAULT_LOCALE } from '@/constants/config'

function detectInitialLocale(route) {
	const urlLocale = route?.params?.locale
	const storageLocale = localStorage.getItem('lastLocale')

	return localeCodes.includes(urlLocale)
		? urlLocale
		: storageLocale || DEFAULT_LOCALE
}

export default detectInitialLocale
