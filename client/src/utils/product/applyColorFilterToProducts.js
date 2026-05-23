/**
 * Returns a new array of products where each product’s `defaultVariant`
 * is adjusted to match one of the provided color IDs, if possible.
 *
 * - If the product’s current `defaultVariant` already has a color in `colors`,
 *   the product is left unchanged.
 * - Otherwise, the first variant matching one of the colors is chosen as the new
 *   `defaultVariant`.
 * - If no variants match, the original product is returned.
 *
 * @param {Array<Object>} products
 *   — array of product objects, each with:
 *     • variants: Array<{ _id: string, color: { _id: string } }>
 *     • defaultVariant: string  (ID of the currently active variant)
 * @param {Array<string>} colors
 *   — array of allowed color IDs (e.g. `['color1', 'color2']`)
 * @returns {Array<Object>}
 *   — new array of products with potentially updated `defaultVariant` values
 */

const applyColorFilterToProducts = (products, colors) => {
	if (!colors.length) {
		return products
	}

	const filterSet = new Set(colors)

	return products.map((p) => {
		const active = p.variants.find((v) => v._id === p.defaultVariant)

		if (active && filterSet.has(active.color._id)) {
			return p
		}

		const match = p.variants.find((v) => filterSet.has(v.color._id))
		return match ? { ...p, defaultVariant: match._id } : p
	})
}

export default applyColorFilterToProducts
