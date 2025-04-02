class FormatValidationErrors {
	static formatExpressErrors(errorsObj) {
		return errorsObj.errors.map((error) => ({
			message: error.msg,
		}))
	}

	static formatMongooseErrors(errorsString, collectionName) {
		if (errorsString.includes('E11000')) {
			return [
				{
					message: 'Email already in use. Please choose another.',
				},
			]
		}

		const errorMessagesPart = errorsString.split(`: ${collectionName} validation failed: `)[1]
		if (!errorMessagesPart) return []

		const errorMessages = errorMessagesPart.split(', ')

		return errorMessages.map((error) => {
			const parts = error.split(': ')
			const message = parts.slice(1).join(': ').trim()
			return { message }
		})
	}
	static formatMongooseUpdateErrors(errorString) {
		const errorMessagesPart = errorString.split('Validation failed: ')[1]
		if (!errorMessagesPart) return []

		const errorMessages = errorMessagesPart.split(', ')

		return errorMessages.map((error) => {
			const parts = error.split(': ')
			const field = parts[0].trim()
			const message = parts.slice(1).join(': ').trim()
			return { field, message }
		})
	}
}

export default FormatValidationErrors
