import fs from 'fs'
import path from 'path'

/**
 * Removes product images from disk.
 *
 * @param {Array<string>} imagePaths - Image paths list.
 * @returns {void}
 */

const removeProductImages = (imagePaths = []) => {
	imagePaths.forEach((imagePath) => {
		try {
			if (!imagePath || typeof imagePath !== 'string') {
				return
			}

			const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

			const absolutePath = path.join(process.cwd(), 'public', normalizedPath)

			if (!fs.existsSync(absolutePath)) {
				console.warn(`File not found: ${absolutePath}`)

				return
			}

			fs.unlinkSync(absolutePath)
		} catch (err) {
			console.warn(`Failed to remove image: ${imagePath}`, err)
		}
	})
}

export default removeProductImages
