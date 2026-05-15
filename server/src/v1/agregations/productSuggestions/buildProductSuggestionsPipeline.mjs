import { formatStages } from './productSuggestionsStages.mjs'

const buildProductSuggestionsPipeline = (title, titleLang, sliceLimit, searchDepth) => {
	const titlePath = `$title.${titleLang}`

	if (title) {
		return [
			{
				$search: {
					index: 'titles',
					autocomplete: {
						query: title,
						path: `title.${titleLang}`,
						fuzzy: { maxEdits: 1 },
					},
				},
			},
			...formatStages(titlePath, sliceLimit),
		]
	}

	return [
		{ $sort: { maxRating: -1, createdAt: -1 } },
		{ $limit: searchDepth },
		...formatStages(titlePath, sliceLimit),
	]
}

export default buildProductSuggestionsPipeline
