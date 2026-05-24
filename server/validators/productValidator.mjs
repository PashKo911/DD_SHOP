import mongoose from 'mongoose'
import { HttpError } from '../errors/HttpError.mjs'
import { errorCodes } from '../constants/errorCodes.mjs'

const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value)

export const createValidationError = (details) => {
	throw new HttpError(400, 'Incorrect product data', {
		code: errorCodes.VALIDATION_ERROR,
		details,
		expose: true,
	})
}

const parseLocalizedField = (value, field) => {
	let parsedValue = value

	if (typeof value === 'string') {
		try {
			parsedValue = JSON.parse(value)
		} catch {
			createValidationError([{ field, validationCode: 'invalid' }])
		}
	}

	if (!parsedValue || typeof parsedValue !== 'object') {
		createValidationError([{ field, validationCode: 'required' }])
	}

	const en = `${parsedValue.en || ''}`.trim()
	const uk = `${parsedValue.uk || ''}`.trim()

	if (en.length < 3 || uk.length < 3) {
		createValidationError([{ field, validationCode: 'invalid' }])
	}

	return { en, uk }
}

const parseNumericField = (value, field, { min = 0, max = null, allowNull = false } = {}) => {
	if ((value === null || value === undefined || value === '') && allowNull) {
		return null
	}

	const numericValue = Number(value)
	if (!Number.isFinite(numericValue) || numericValue < min || (max != null && numericValue > max)) {
		createValidationError([{ field, validationCode: 'invalid', params: { value } }])
	}

	return numericValue
}

const parseVariants = (value) => {
	let parsed = value

	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value)
		} catch {
			createValidationError([{ field: 'variants', validationCode: 'invalid' }])
		}
	}

	if (!Array.isArray(parsed) || parsed.length === 0) {
		createValidationError([{ field: 'variants', validationCode: 'required' }])
	}

	return parsed.map((variant, index) => {
		if (!variant || typeof variant !== 'object') {
			createValidationError([{ field: `variants.${index}`, validationCode: 'invalid' }])
		}

		const images = Array.isArray(variant.images)
			? variant.images.filter((imagePath) => typeof imagePath === 'string' && imagePath.length)
			: []
		const sizes = Array.isArray(variant.sizes) ? variant.sizes.filter(Boolean) : []

		if (!isMongoId(variant.color)) {
			createValidationError([{ field: `variants.${index}.color`, validationCode: 'invalid' }])
		}

		if (!sizes.length || sizes.some((sizeId) => !isMongoId(sizeId))) {
			createValidationError([{ field: `variants.${index}.sizes`, validationCode: 'invalid' }])
		}

		return {
			...(variant._id && isMongoId(variant._id) ? { _id: variant._id } : {}),
			color: variant.color,
			price: parseNumericField(variant.price, `variants.${index}.price`),
			oldPrice: parseNumericField(variant.oldPrice, `variants.${index}.oldPrice`, {
				min: 0,
				allowNull: true,
			}),
			count: parseNumericField(variant.count, `variants.${index}.count`),
			rating: parseNumericField(variant.rating, `variants.${index}.rating`, {
				min: 0,
				max: 5,
			}),
			images,
			sizes,
		}
	})
}

class ProductValidator {
	static validatePayload(payload) {
		if (!isMongoId(payload.category)) {
			createValidationError([{ field: 'category', validationCode: 'invalid' }])
		}

		if (!isMongoId(payload.style)) {
			createValidationError([{ field: 'style', validationCode: 'invalid' }])
		}

		const variants = parseVariants(payload.variants)

		return {
			title: parseLocalizedField(payload.title, 'title'),
			description: parseLocalizedField(payload.description, 'description'),
			category: payload.category,
			style: payload.style,
			defaultVariant:
				payload.defaultVariant && isMongoId(payload.defaultVariant) ? payload.defaultVariant : undefined,
			variants,
		}
	}
}

export default ProductValidator
