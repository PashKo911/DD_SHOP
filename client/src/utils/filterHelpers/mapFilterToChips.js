/**
 * Build filter chips.
 *
 * @param {Object} filter Active filter values
 * @param {Object} options Option metadata ({ key: [{_id,label}] })
 * @param {Object} defaultFilter Default filter state
 * @param {(value:number, type?:string)=>string} numberFormatter Formatting function (e.g. from i18n)
 * @returns {Array<{key:string,value:any,label:string}>} Chips
 */

function mapFilterToChips(filter, options, defaultFilter, numberFormatter) {
	const ignoredKeys = new Set(['gender', 'perPage', 'page', 'sort', 'title'])
	const chips = []

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
				label: `${numberFormatter(min, 'currency')} – ${numberFormatter(max, 'currency')}`,
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
