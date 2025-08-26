import { localeCodes } from '@/config/i18nConfig'
import { DEFAULT_LOCALE } from '@/constants/config'

function detectLocale(route) {
	const storageLocale = localStorage.getItem('locale')
	const urlLocale = route?.params?.locale

	if (urlLocale && localeCodes.includes(urlLocale)) {
		if (storageLocale !== urlLocale) {
			localStorage.setItem('locale', urlLocale)
		}
		return urlLocale
	}

	if (storageLocale && localeCodes.includes(storageLocale)) {
		return storageLocale
	}

	return DEFAULT_LOCALE
}

export default detectLocale
