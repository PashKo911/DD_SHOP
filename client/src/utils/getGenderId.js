export default function getGenderId(filter, facetOptions) {
	if (
		!Array.isArray(facetOptions.value.genders) ||
		!filter.gender ||
		typeof filter.gender !== 'string'
	) {
		return null
	}
	const found = facetOptions.value.genders.find(
		(g) => g.label.en === filter.gender,
	)
	return found ? found._id : null
}
