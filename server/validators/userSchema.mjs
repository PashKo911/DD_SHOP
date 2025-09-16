import { validationErrorCodes } from '../constants/validationErrorCodes.mjs'

const userSchema = {
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
	password: {
		notEmpty: {
			errorMessage: validationErrorCodes.REQUIRED,
		},
		isLength: {
			options: { min: 8 },
			errorMessage: validationErrorCodes.LENGTH,
		},
	},
}

export default userSchema
