import { validationErrorCodes } from '../constants/validationErrorCodes.mjs'

const subscriberSchema = {
	email: {
		isEmail: {
			errorMessage: validationErrorCodes.INVALID,
		},
		notEmpty: {
			errorMessage: validationErrorCodes.REQUIRED,
		},
		isLength: {
			options: { min: 3, max: 50 },
			errorMessage: validationErrorCodes.LENGTH,
		},
	},
}

export default subscriberSchema
