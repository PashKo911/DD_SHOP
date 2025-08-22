/**
 * Converts a filter object into an array of "chips" for displaying
 * the currently selected filter parameters in the UI.
 *
 * @param {Record<string, any>} filter
 *   - An object whose keys are filter field names and values are the currently selected values.
 * @param {Record<string, Array<{
 *     _id: string;
 *     label: string;
 *   }>>} options
 *   - Metadata for options used by filters with predefined choices.
 *     Each option object must include `_id` and `label`, where `label`
 *     is a human-readable string (e.g. `'sport'` or `'спортивний'`).
 * @param {Record<string, any>} defaultFilter
 *   - The default filter state; fields equal to their default values are ignored.
 * @param {string} [locale='en']
 *   - Locale code used to format numbers/currencies via `Intl.NumberFormat`
 *     (examples: 'en', 'uk').
 * @param {{ currency: string }} currency
 *   - Currency settings (object with `.currency`), used for formatting price ranges.
 *
 * @returns {Array<{
 *   key: string;    // filter field name
 *   value: any;     // raw value or option id
 *   label: string;  // human-readable label for the chip (taken from meta.label or stringified value)
 * }>}
 *   - An array of chip objects representing all active, non-default filters.
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
			const label = meta.label
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
