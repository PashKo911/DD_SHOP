import { appConstants } from '../constants/app.mjs'

/**
 * Resolves a valid locale from the request object.
 * If the 'Accept-Language' header is missing or the locale is not supported,
 * it returns the default language.
 *
 * @param {import('express').Request} req - Express request object
 * @returns {string} - Valid locale string
 */
export function resolveLocale(req) {
	const reqLang = req.headers['accept-language']
	return appConstants.supportedLanguages.includes(reqLang) ? reqLang : appConstants.defaultLanguage
}
