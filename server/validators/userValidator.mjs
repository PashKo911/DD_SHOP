class UserValidator {
	static userSchema = {
		// username: {
		// 	trim: true,
		// 	notEmpty: {
		// 		errorMessage: 'Full Name is required',
		// 	},
		// 	isLength: {
		// 		options: { min: 3, max: 50 },
		// 		errorMessage: 'Full Name must be between 3 and 50 characters long',
		// 	},
		// 	escape: true,
		// },
		email: {
			isEmail: {
				errorMessage: 'Invalid email address',
			},
			normalizeEmail: true,
			notEmpty: {
				errorMessage: 'Email is required',
			},
			isLength: {
				options: { min: 3, max: 50 },
				errorMessage: 'Email must be between 3 and 50 characters long',
			},
			escape: true,
		},
		password: {
			trim: true,
			notEmpty: {
				errorMessage: 'Password is required',
			},
			isLength: {
				options: { min: 4 },
				errorMessage: 'Password must be at least 4 characters long',
			},
			// matches: {
			// 	options: [/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/],
			// 	errorMessage: 'Password must contain at least one letter, one number, and one special character',
			// },
			escape: true,
		},
	}
	static authSchema = {
		email: {
			isEmail: {
				errorMessage: 'Invalid email address',
			},
			normalizeEmail: true,
			notEmpty: {
				errorMessage: 'Email is required',
			},
			isLength: {
				options: { min: 3, max: 50 },
				errorMessage: 'Email must be between 3 and 50 characters long',
			},
			escape: true,
		},

		password: {
			trim: true,
			notEmpty: {
				errorMessage: 'Password is required',
			},
			isLength: {
				options: { min: 4 },
				errorMessage: 'Password must be at least 4 characters long',
			},
			// matches: {
			// 	options: [/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/],
			// 	errorMessage: 'Password must contain at least one letter, one number, and one special character',
			// },
			escape: true,
		},
	}
}

export default UserValidator
