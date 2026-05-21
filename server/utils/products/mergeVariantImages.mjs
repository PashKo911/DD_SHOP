/**
 * Merges variant images with uploaded images.
 *
 * @param {Array<Object>} variants - Variants list.
 * @param {Object} uploadedImagesMap - Uploaded images by variant index.
 * @returns {Array<Object>}
 */

const mergeVariantImages = (variants, uploadedImagesMap) => {
	return variants.map((variant, index) => {
		const keptImages = Array.isArray(variant.images) ? variant.images : []

		const uploadedImages = uploadedImagesMap[index] || []

		return {
			...variant,
			images: [...keptImages, ...uploadedImages],
		}
	})
}

export default mergeVariantImages
