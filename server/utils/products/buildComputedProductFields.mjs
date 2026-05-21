/**
 * Builds computed product fields from variants.
 *
 * @param {Array<Object>} variants - Product variants list.
 * @param {string} categoryKey - Product category key.
 * @returns {{
 *   categoryKey: string,
 *   minPrice: number,
 *   maxPrice: number,
 *   maxRating: number,
 *   defaultVariant: string
 * }}
 */

const buildComputedProductFields = (variants, categoryKey) => {
	const prices = variants.map((variant) => Number(variant.price))
	const ratings = variants
		.map((variant) => Number(variant.rating))
		.filter((rating) => Number.isFinite(rating))

	const cheapestVariant = variants.reduce((best, current) =>
		Number(current.price) < Number(best.price) ? current : best
	)

	return {
		categoryKey,
		minPrice: Math.min(...prices),
		maxPrice: Math.max(...prices),
		maxRating: ratings.length ? Math.max(...ratings) : 0,
		defaultVariant: cheapestVariant._id,
	}
}

export default buildComputedProductFields
