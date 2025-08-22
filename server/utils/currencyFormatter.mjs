/**
 * Creates and returns a memoized currency formatter using Intl.NumberFormat.
 *
 * The function caches formatters based on language and currency to avoid
 * recreating them for repeated calls with the same parameters.
 *
 * @function createCurrencyFormatter
 * @param {string} language - Language code, e.g. "uk" for Ukrainian or "en" for English.
 * @param {string} currency - ISO 4217 currency code, e.g. "USD", "EUR", "UAH".
 * @returns {Intl.NumberFormat} A formatter instance configured for the specified locale and currency.
 */

export const createCurrencyFormatter = (() => {
	const cache = new Map()
	return (language, currency) => {
		const key = `${language}:${currency}`
		if (cache.has(key)) return cache.get(key)
		const locale = language === 'uk' ? 'uk-UA' : 'en-US'
		const f = new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
			maximumFractionDigits: 0,
		})
		cache.set(key, f)

		return f
	}
})()
