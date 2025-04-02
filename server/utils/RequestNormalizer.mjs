import mongoose from 'mongoose'

class RequestNormalizer {
	static normalizeStringField(field) {
		if (!field) return null

		if (field.startsWith('[')) {
			try {
				const parsedArray = JSON.parse(field)
				return RequestNormalizer.normalizeArrayField(parsedArray)
			} catch (error) {
				console.error('Error parsing JSON string:', error.message)
				return null
			}
		}

		if (mongoose.Types.ObjectId.isValid(field)) {
			return new mongoose.Types.ObjectId(field)
		}

		return field
	}

	static normalizeArrayField(field) {
		if (!Array.isArray(field)) return field

		const isValidArray = field.every((item) => mongoose.Types.ObjectId.isValid(item))

		if (isValidArray) {
			return field.map((item) => new mongoose.Types.ObjectId(item))
		}

		return field
	}

	static normalizeField(field) {
		if (typeof field === 'string') {
			return RequestNormalizer.normalizeStringField(field)
		}

		if (Array.isArray(field)) {
			return RequestNormalizer.normalizeArrayField(field)
		}

		return field
	}

	static normalize(req, res, next) {
		try {
			for (const [key, value] of Object.entries(req.body)) {
				req.body[key] = RequestNormalizer.normalizeField(value)
			}

			req.body.paths = req.files?.map((file) => `/images/products/${req.category}/${file.filename}`) || []

			next()
		} catch (error) {
			console.error('Error in request normalization middleware:', error.message)
			res.status(400).json({ error: 'Invalid request data' })
		}
	}
}

export default RequestNormalizer
