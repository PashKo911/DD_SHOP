/**
 * Groups uploaded files by variant index.
 *
 * @param {Array<Object>} files - Uploaded files list.
 * @returns {Object}
 */

const groupUploadedFilesByVariant = (files = []) => {
	return files.reduce((acc, file) => {
		const match = file.fieldname.match(/^variantImages-(\d+)$/)

		if (!match) {
			return acc
		}

		const variantIndex = Number(match[1])

		if (!Array.isArray(acc[variantIndex])) {
			acc[variantIndex] = []
		}

		acc[variantIndex].push(file)

		return acc
	}, {})
}

export default groupUploadedFilesByVariant
