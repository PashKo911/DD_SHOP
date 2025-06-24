/**
 * Remove a chip from the given filter object.
 *
 * @param {object} filter
 * @param {object} defaults
 * @param {{ key: string; value: any }} chip
 */
export function removeFilterChip(filter, defaults, chip) {
	const { key, value } = chip
	filter.page = 0

	if (!(key in filter)) return

	if (key === 'price') {
		filter.price = defaults.price
		return
	}

	if (Array.isArray(filter[key])) {
		filter[key] = filter[key].filter((f) => f !== value)
		return
	}

	filter[key] = defaults[key]
}
