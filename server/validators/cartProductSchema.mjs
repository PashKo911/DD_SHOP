import { validationErrorCodes } from '../constants/validationErrorCodes.mjs'

const cartProductSchema = {
	product: {
		notEmpty: {
			errorMessage: validationErrorCodes.REQUIRED,
		},
		isMongoId: {
			errorMessage: validationErrorCodes.INVALID,
		},
	},
	variant: {
		notEmpty: {
			errorMessage: validationErrorCodes.REQUIRED,
		},
		isMongoId: {
			errorMessage: validationErrorCodes.INVALID,
		},
	},
	size: {
		notEmpty: {
			errorMessage: validationErrorCodes.REQUIRED,
		},
		isMongoId: {
			errorMessage: validationErrorCodes.INVALID,
		},
	},
	quantity: {
		notEmpty: {
			errorMessage: validationErrorCodes.REQUIRED,
		},
		isInt: {
			options: { min: 1 },
			errorMessage: validationErrorCodes.NUMERIC,
		},
		toInt: true,
	},
}

export default cartProductSchema
