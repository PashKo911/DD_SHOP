import { localeCodes } from '@/config/i18nConfig'
import { DEFAULT_LOCALE } from '@/config/appConfig'

/**
 * Detects and resolves the appropriate locale for the application.
 *
 * The function checks for the locale in the following order of priority:
 * 1. **URL parameter (`route.params.locale`)** — if it exists and is a valid locale, it overrides everything else
 *    and also updates `localStorage` if it differs from the stored locale.
 * 2. **LocalStorage (`locale`)** — if available and valid, it is returned.
 * 3. **Default locale (`DEFAULT_LOCALE`)** — used as a fallback if neither of the above are valid.
 *
 * @param {Object} route - The Vue Router route object. Expected to have a `params.locale` field.
 * @param {string} [route.params.locale] - Optional locale code from the current route parameters.
 * @returns {string} - The resolved locale code to be used in the application.
 */
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
