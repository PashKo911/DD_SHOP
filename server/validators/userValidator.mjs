import { validationErrorCodes } from '../config/validationErrorCodes.mjs'

class UserValidator {
	static userSchema = {
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
}
export default UserValidator
