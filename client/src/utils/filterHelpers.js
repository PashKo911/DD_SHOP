export function serializeFilter(filter, options) {
	if (!Object.keys(options).length) return {}
	return Object.entries(filter).reduce((q, [key, val]) => {
		const arr = Array.isArray(val) ? val : []
		if (!arr.length) return q

		if (key === 'price') {
			q.price = arr.join(',')
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
		const val = query[key]
		if (typeof val !== 'string' || !val.length) continue

		const values = val.split(',').filter(Boolean)

		if (key === 'price') {
			filter[key] = values.map(Number)
		} else {
			const options = Array.isArray(facetOptions[key]) ? facetOptions[key] : []
			filter[key] = options
				.filter((fo) => values.includes(String(fo.label)))
				.map((fo) => fo._id)
		}
	}
}
