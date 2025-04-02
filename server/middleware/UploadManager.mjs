import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const ALLOWED_CATEGORIES = [
	{ _id: '676bff1e8a281b4943246179', name: 'men' },
	{ _id: '676bff1e8a281b4943246178', name: 'women' },
]

const createFolderIfNotExists = (folderPath) => {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const categoryId = req.body.gender

		const category = ALLOWED_CATEGORIES.find((cat) => cat._id === categoryId)

		if (!category) {
			return cb(new Error('Invalid category'), null)
		}

		const folderPath = path.join(req.__dirname, '../public/images/products', category.name)
		createFolderIfNotExists(folderPath)

		req.uploadFolderPath = folderPath
		req.category = category.name

		cb(null, folderPath)
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
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
