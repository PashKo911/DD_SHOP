/**
 * Collects all variant images.
 *
 * @param {Array<Object>} variants - Variants list.
 * @returns {Array<string>}
 */

const collectVariantImages = (variants = []) =>
	variants.flatMap((variant) => (Array.isArray(variant.images) ? variant.images : []))

export default collectVariantImages
