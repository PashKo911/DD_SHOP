import { getSearchField } from './getSearchField'

/**
 * Serializes the filter into a query parameters object.
 * Skips any keys whose values match defaults, omits the 'category' field,
 * and applies special conversion logic for certain fields (e.g. page, price).
 *
 * @param {{ [key: string]: string|number|Array<any> }} filter
 *   Current filter values (strings, numbers or arrays of IDs).
 * @param {{ [key: string]: Array<{ _id: any, label: string }> }} options
 *   Facet metadata: for array-based fields maps IDs → label.
 * @param {{ [key: string]: any }} defaultFilter
 *   A map of default values; used to skip unchanged fields.
 * @returns {{ [param: string]: string|number }}
 *   A new object with query parameters ready for URL or API usage.
 *
 * @example
  // Given:
  // filter = { page: 0, price: [10,50], colors: [1,2], category: 'M' }
  // defaultFilter.page = 0, defaultFilter.price = [0,100]
  // options.colors = [{_id:1,label:'Red'},{_id:2,label:'Blue'}]
  // Result: { page: 1, price: '10,50', colors: 'Red,Blue' }
 */

function serializeFilter(filter, options, defaultFilter, locale) {
	const searchField = getSearchField(locale)
	const result = {}
	const handlers = {
		page: (val) => {
			if (val > 0) return Number(val) + 1
		},
		sort: (val) => {
			return defaultFilter.sort.value !== val.value ? val[searchField] : null
		},
		price: (arr) => {
			const [min, max] = arr
			const [optMin, optMax] = options.price ?? []
			if (min !== optMin || max !== optMax) {
				return arr.join(',')
			}
		},
	}

	for (const [key, val] of Object.entries(filter)) {
		if (key === 'category') continue
		const def = defaultFilter[key]

		const isDefault = Array.isArray(def)
			? Array.isArray(val) && val.length === 0
			: val === def
		if (isDefault) continue

		if (handlers[key]) {
			const out = handlers[key](val)
			if (out != null) result[key] = out
			continue
		}

		if (!Array.isArray(val)) {
			result[key] = val
			continue
		}

		const opts = Array.isArray(options[key]) ? options[key] : null
		if (opts) {
			const labels = opts
				.filter((o) => val.includes(String(o._id)))
				.map((o) => {
					const label = o[searchField] ?? o.label
					return label.toLowerCase()
				})
			if (labels.length) {
				result[key] = labels.join(',')
			}
		} else if (val.length) {
			result[key] = val.join(',')
		}
	}
	return result
}

export default serializeFilter
