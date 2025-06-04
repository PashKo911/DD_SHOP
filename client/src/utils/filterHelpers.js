export function serializeFilter(filter, options) {
	if (!Object.keys(options).length) return {}
	return Object.entries(filter).reduce((q, [key, val]) => {
		if (key === 'page' && val > 0) {
			q[key] = Number(val) + 1
			return q
		}
		if (!Array.isArray(val) && key !== 'perPage' && key !== 'gender' && val) {
			q[key] = val
			return q
		}
		const arr = Array.isArray(val) ? val : []
		if (!arr.length) return q

		if (key === 'price') {
			const [min, max] = arr
			const [optionsMin, optionsMax] = options[key]

			if (min !== optionsMin || max !== optionsMax) {
				q.price = arr.join(',')
			}

			return q
		}

		const opts = Array.isArray(options[key]) ? options[key] : []

		const labels = opts
			.filter((fo) => arr.includes(String(fo._id)))
			.map((fo) => fo.label)

		if (labels.length) {
			q[key] = labels.join(',')
		}
		return q
	}, {})
}

export function parseFilter(query, filter, facetOptions) {
	for (const key of Object.keys(filter)) {
		if (key === 'gender') continue

		const val = query[key]
		if (typeof val !== 'string' || !val.length) continue

		const values = val.split(',').filter(Boolean)

		if (!Array.isArray(facetOptions[key])) {
			if (key === 'page') {
				filter[key] = Number(val) - 1
				continue
			}
			filter[key] = val
		} else if (key === 'price') {
			filter[key] = values.map(Number)
		} else {
			const options = Array.isArray(facetOptions[key]) ? facetOptions[key] : []
			filter[key] = options
				.filter((fo) => values.includes(String(fo.label)))
				.map((fo) => fo._id)
		}
	}
}
