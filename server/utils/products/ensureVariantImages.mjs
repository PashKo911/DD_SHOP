import { createValidationError } from '../../validators/productValidator.mjs'

/**
 * Checks that all variants have images.
 *
 * @param {Array<Object>} variants - Variants list.
 * @returns {void}
 */

const ensureVariantImages = (variants = []) => {
	const invalidVariantIndex = variants.findIndex(
		(variant) => !Array.isArray(variant.images) || variant.images.length === 0
	)

	if (invalidVariantIndex !== -1) {
		createValidationError([
			{
				field: `variants.${invalidVariantIndex}.images`,
				validationCode: 'required',
			},
		])
	}
}

export default ensureVariantImages
