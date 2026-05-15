import fs from 'fs'
import path, { dirname } from 'path'

export const deleteUploadedFiles = (files, uploadFolderPath) => {
	if (files.length) {
		files.forEach((file) => {
			const filePath = path.join(uploadFolderPath, file.filename)
			try {
				fs.unlinkSync(filePath)
			} catch (err) {
				console.error(`Error while deleting file ${filePath}:`, err)
			}
		})
	}
}

export const deleteEditedFiles = (paths, uploadFolderPath) => {
	if (paths.length) {
		paths.forEach((path) => {
			const filePath = `${uploadFolderPath}/${path.split('/').pop()}`

			try {
				fs.unlinkSync(filePath)
			} catch (error) {
				console.error(`Error while deleting file ${filePath}:`, err)
			}
		})
	}
}
