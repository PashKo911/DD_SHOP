import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const ALLOWED_CATEGORIES = new Set(['men', 'women'])

const createFolderIfNotExists = (folderPath) => {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const categoryKey = `${req.body.categoryKey || ''}`.trim().toLowerCase()

		if (!ALLOWED_CATEGORIES.has(categoryKey)) {
			return cb(new Error('Invalid category'), null)
		}

		const folderPath = path.join(
			req.__dirname,
			'../public/uploads/products',
			categoryKey,
		)
		createFolderIfNotExists(folderPath)

		req.uploadFolderPath = folderPath
		req.category = categoryKey

		cb(null, folderPath)
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname) || '.webp'
		cb(null, `image-${uuidv4()}${ext}`)
	},
})

const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
		} else {
			cb(new Error('Only image files are allowed!'), false)
		}
	},
})

export default upload
