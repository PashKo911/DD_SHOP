import { i18nMeta } from '@/config/i18n'
import shopConstants from '@/constants/shop'

/**
 * Detects and resolves the appropriate locale for the application.
 *
 * The function checks for the locale in the following order of priority:
 * 1. **URL parameter (`route.params.locale`)** — if it exists and is a valid locale, it overrides everything else
 *    and also updates `localStorage` if it differs from the stored locale.
 * 2. **LocalStorage (`locale`)** — if available and valid, it is returned.
 * 3. **Default locale (`i18nMeta.defaultLocale`)** — used as a fallback if neither of the above are valid.
 *
 * @param {Object} route - The Vue Router route object. Expected to have a `params.locale` field.
 * @param {string} [route.params.locale] - Optional locale code from the current route parameters.
 * @returns {string} - The resolved locale code to be used in the application.
 */
function detectLocale(route) {
	const storageLocale = localStorage.getItem(shopConstants.storageKeys.locale)
	const urlLocale = route?.params?.locale

	if (urlLocale && i18nMeta.localeCodes.includes(urlLocale)) {
		if (storageLocale !== urlLocale) {
			localStorage.setItem(shopConstants.storageKeys.locale, urlLocale)
		}
		return urlLocale
	}

	if (storageLocale && i18nMeta.localeCodes.includes(storageLocale)) {
		return storageLocale
	}

	return i18nMeta.defaultLocale
}

export default detectLocale
