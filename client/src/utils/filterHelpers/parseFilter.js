/**
 * Parses URL query parameters into the internal filter object, restoring defaults and mapping values.
 *
 * @param {Object.<string,string>} query
 *   The raw query parameters from the URL (all values are strings or undefined).
 * @param {Object} filter
 *   A reactive filter object whose properties will be overwritten according to the parsed query.
 * @param {Object} defaultFilter
 *   A map of default values for each filter field; used to reset or validate parsed values.
 * @param {Object.<string,Array<{ _id: any, label: string }>>} facetOptions
 *   Metadata for filterable facets, mapping each field name to an array of option objects
 *   (each with an `_id` and `label`) that allow converting between labels and IDs.
 *
 * @example
  // Given URL ?page=2&price=10,50&colors=Red,Blue
 * parseFilter(
 *   { page: '2', price: '10,50', colors: 'Red,Blue' },
 *   filter,            // e.g. { page: 0, price: [], colors: [], ... }
 *   DEFAULT_FILTER,    // e.g. { page: 0, price: [0, 100], colors: [], ... }
 *   facetOptions       // e.g. { colors: [{ _id: 1, label: 'Red' }, { _id: 2, label: 'Blue' }], ... }
 * );
  // Resulting `filter`:
  //   page: 1
  //   price: [10, 50]
  //   colors: [1, 2]
 *
 * @returns {void}
 *   The function mutates the `filter` object in place and does not return a value.
 */

function parseFilter(
	query,
	filter,
	defaultFilter,
	facetOptions,
	sortOptionsData,
	t,
) {
	const parsers = {
		page: (v) => {
			const n = Number(v) - 1
			return Number.isInteger(n) && n >= 0 ? n : defaultFilter.page
		},
		sort: (v) => {
			const found = sortOptionsData.find(({ value }) => value === v)
			return found ? { ...found, label: t(found.label) } : defaultFilter.sort
		},
		price: (v) => {
			const numbers = v.split(',').map(Number)
			return numbers.length === 2 && numbers.every((x) => !Number.isNaN(x))
				? numbers
				: defaultFilter.price
		},
	}

	for (const [key, def] of Object.entries(defaultFilter)) {
		if (key === 'gender') continue

		const raw = query[key]
		if (!raw) {
			filter[key] = def
			continue
		}

		if (parsers[key]) {
			filter[key] = parsers[key](raw)
			continue
		}

		const values = raw.split(',').filter(Boolean)
		if (!Array.isArray(facetOptions[key])) {
			filter[key] = raw
		} else {
			filter[key] = facetOptions[key]
				.filter((opt) => values.includes(String(opt.label)))
				.map((opt) => opt._id)
		}
	}
}

export default parseFilter
