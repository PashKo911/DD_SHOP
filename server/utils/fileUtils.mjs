import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicRoot = path.join(__dirname, '../public')

export const deleteUploadedFiles = (files = [], uploadFolderPath) => {
	if (files.length && uploadFolderPath) {
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

export const deleteEditedFiles = (paths = []) => {
	if (paths.length) {
		paths.forEach((relativePath) => {
			if (!relativePath || typeof relativePath !== 'string') return
			const normalizedPath = relativePath.replace(/^\/+/, '')
			const filePath = path.join(publicRoot, normalizedPath)

			try {
				fs.unlinkSync(filePath)
			} catch (error) {
				console.error(`Error while deleting file ${filePath}:`, error)
			}
		})
	}
}
