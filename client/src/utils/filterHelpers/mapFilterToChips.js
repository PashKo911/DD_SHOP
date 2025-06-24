/**
 * Converts a filter object into an array of “chips” for displaying
 * the currently selected filter parameters.
 *
 * @param {Record<string, any>} filter
 *   — An object mapping filter names to their active values.
 * @param {Record<string, Array<{
 *     _id: string;
 *     label: string;
 *     labelUk?: string;
 *   }>>} options
 *   — Option metadata for filters with predefined choices
 *     (each entry has an `_id`, a default `label`, and an optional Ukrainian `labelUk`).
 * @param {Record<string, any>} defaultFilter
 *   — The default filter state, used to skip any unmodified parameters.
 * @param {string} [locale='en']
 *   — Locale code for formatting numbers and currency (e.g. 'en', 'uk').
 * @param {{ currency: string }} currency
 *   — Currency settings (must include `.currency` code) for price formatting.
 *
 * @returns {Array<{
 *   key: string;    // Filter field name
 *   value: any;     // Raw value or option ID
 *   label: string;  // Human-readable label for the chip
 * }>}
 *   — An array of chip objects representing all active, non-default filters.
 */
function mapFilterToChips(filter, options, defaultFilter, locale, currency) {
	const ignoredKeys = new Set(['gender', 'perPage', 'page', 'sort'])
	const chips = []

	const priceFormatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency.currency,
		currencyDisplay: 'narrowSymbol',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})

	function isDefaultValue(key, value) {
		const def = defaultFilter[key]
		if (value == null) {
			return true
		}
		if (typeof value === 'string' && value === '') {
			return true
		}
		if (Array.isArray(def)) {
			return Array.isArray(value) && value.length === 0
		}
		return value === def
	}

	function generatePriceChips({ value }) {
		const [min, max] = value
		const [minDef, maxDef] = options.price
		if (min === minDef && max === maxDef) return defaultFilter.price
		return [
			{
				key: 'price',
				value: `${min}-${max}`,
				label: `${priceFormatter.format(min)} – ${priceFormatter.format(max)}`,
			},
		]
	}

	function generateOptionChips({ key, value }) {
		const lookup = new Map(options[key].map((o) => [String(o._id), o]))

		return value.flatMap((id) => {
			const meta = lookup.get(String(id))
			if (!meta) return []
			const label = locale === 'uk' && meta.labelUk ? meta.labelUk : meta.label
			return { key, value: meta._id, label }
		})
	}

	function generateSimpleChips({ key, value }) {
		return [{ key, value, label: String(value) }]
	}

	const handlers = {
		price: generatePriceChips,
		styles: generateOptionChips,
		colors: generateOptionChips,
		sizes: generateOptionChips,
		default: generateSimpleChips,
	}

	for (const [key, value] of Object.entries(filter)) {
		if (ignoredKeys.has(key) || isDefaultValue(key, value)) continue

		const handler = handlers[key] || handlers.default
		chips.push(...handler({ key, value }))
	}

	return chips
}

export default mapFilterToChips
