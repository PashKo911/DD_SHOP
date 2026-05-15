import { appConstants } from '../constants/app.mjs'

/**
 * Detects locale from input string.
 * Returns 'uk', 'en', or default language.
 * @param {string} input
 * @returns {string}
 */
export default function detectLang(input) {
	const [en, uk] = appConstants.supportedLanguages

	if (/[а-яА-ЯіІїЇєЄ]/.test(input)) return uk
	if (/[A-Za-zÀ-ÖØ-öø-ÿĀ-žḀ-ỿ]/.test(input)) return en

	return appConstants.defaultLanguage
}
