import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const TEMP_UPLOADS_FOLDER = 'public/uploads/temp'

const createFolderIfNotExists = (folderPath) => {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}
}

const tempUploadPath = path.join(process.cwd(), TEMP_UPLOADS_FOLDER)

createFolderIfNotExists(tempUploadPath)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, tempUploadPath)
	},

	filename: (req, file, cb) => {
		const extension = path.extname(file.originalname) || '.webp'

		cb(null, `temp-${uuidv4()}${extension}`)
	},
})

const upload = multer({
	storage,

	limits: {
		fileSize: 10 * 1024 * 1024,
	},

	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
			return
		}

		cb(new Error('Only image files are allowed'), false)
	},
})

export default upload
