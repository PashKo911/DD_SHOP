class ProductValidator {
	static productSchema = {
		title: {
			trim: true,
			notEmpty: {
				errorMessage: 'Title is required',
			},
			isLength: {
				options: { min: 3, max: 100 },
				errorMessage: 'Title must be between 3 and 100 characters long',
			},
			escape: true,
		},
		price: {
			notEmpty: {
				errorMessage: 'Price is required',
			},
			isFloat: {
				options: { min: 0 },
				errorMessage: 'Price must be a positive number',
			},
			toFloat: true,
		},
		rating: {
			notEmpty: {
				errorMessage: 'Rating is required',
			},
			isFloat: {
				options: {
					min: 2,
					max: 5,
				},
				errorMessage: 'Rating must be an integer between 2 and 5',
			},
			toFloat: true,
		},
		count: {
			notEmpty: {
				errorMessage: 'Count is required',
			},
			isInt: {
				options: {
					min: 1,
				},
				errorMessage: 'Count must be at least 1',
			},
			toInt: true,
		},
		description: {
			optional: true,
			trim: true,
			isLength: {
				options: { min: 10 },
				errorMessage: 'Description must be at least 10 characters long',
			},
			escape: true,
		},
		colors: {
			isArray: {
				errorMessage: 'Colors must be an array',
			},
			custom: {
				options: (value) => Array.isArray(value) && value.length > 0,
				errorMessage: 'At least one color is required',
			},
		},
		sizes: {
			isArray: {
				errorMessage: 'Sizes must be an array',
			},
			custom: {
				options: (value) => Array.isArray(value) && value.length > 0,
				errorMessage: 'At least one size is required',
			},
		},
		styles: {
			notEmpty: {
				errorMessage: 'Dress style is required',
			},
			isMongoId: {
				errorMessage: 'Invalid dress style ID',
			},
		},
		gender: {
			notEmpty: {
				errorMessage: 'Gender is required',
			},
			isMongoId: {
				errorMessage: 'Invalid gender ID',
			},
		},
	}
}

export default ProductValidator
