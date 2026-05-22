import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileConstants } from '../../../constants/files.mjs'

/**
 * Moves variant images to product folder.
 *
 * @param {Object} params - Function params.
 * @param {Object} params.filesByVariant - Files grouped by variant.
 * @param {string} params.categoryKey - Product category key.
 * @param {string} params.productId - Product id.
 * @returns {Object}
 */

const moveVariantImages = ({ filesByVariant, categoryKey, productId }) => {
	const productFolder = path.join(process.cwd(), fileConstants.productUploadsDir, categoryKey, productId)

	fs.mkdirSync(productFolder, {
		recursive: true,
	})

	return Object.entries(filesByVariant).reduce((acc, [variantIndex, files]) => {
		acc[variantIndex] = files.map((file) => {
			const extension = path.extname(file.originalname) || '.webp'
			const filename = `image-${crypto.randomUUID()}${extension}`
			const finalPath = path.join(productFolder, filename)
			fs.renameSync(file.path, finalPath)
			return `/uploads/products/${categoryKey}/${productId}/${filename}`
		})

		return acc
	}, {})
}

export default moveVariantImages
