import { fileConstants } from '../../../constants/files.mjs'

/**
 * Removes product upload folder.
 *
 * @param {Object} params - Function params.
 * @param {string} params.categoryKey - Product category key.
 * @param {string} params.productId - Product id.
 * @returns {void}
 */

const removeProductFolder = ({ categoryKey, productId }) => {
	try {
		const productFolderPath = path.join(
			process.cwd(),
			fileConstants.productUploadsDir,
			categoryKey,
			productId
		)

		if (!fs.existsSync(productFolderPath)) {
			console.warn(`Product folder not found: ${productFolderPath}`)

			return
		}

		fs.rmSync(productFolderPath, {
			recursive: true,
			force: true,
		})
	} catch (err) {
		console.warn(`Failed to remove product folder: ${productId}`, err)
	}
}

export default removeProductFolder
