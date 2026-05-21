import fs from 'fs'

/**
 * Removes temporary uploaded files.
 *
 * @param {Array<Object>} files - Uploaded files list.
 * @returns {void}
 */

const removeTempFiles = (files = []) => {
	files.forEach((file) => {
		if (!file?.path) {
			return
		}

		if (fs.existsSync(file.path)) {
			fs.unlinkSync(file.path)
		}
	})
}

export default removeTempFiles
