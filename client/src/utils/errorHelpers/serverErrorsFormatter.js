/**
 * Formats server errors for UI or forms, showing only one error per field.
 *
 * Only error codes included in `supportedCodes` are converted to field-level errors.
 * Other errors are returned as a general message.
 *
 * @param {object} error - Axios error object from server response.
 * @param {string[]} supportedCodes - List of error codes to normalize at field-level.
 * @returns {object|null} - Normalized error object.
 *                          Example for field-level error:
 *                          { email: { validationCode: 'invalid', value: 'test@mail.com' } }
 *                          Example for general error:
 *                          { general: 'Some server error message' }
 *                          Returns null if no relevant errors found.
 */
function serverErrorsFormatter(error, supportedCodes) {
	if (!error) return null

	const errPayload = error.response?.data?.error
	if (!errPayload || typeof errPayload !== 'object') return null

	const code = String(errPayload.code || '').toUpperCase()
	const details = Array.isArray(errPayload.details) ? errPayload.details : []
	const message = errPayload.message

	const errorsObj = {}

	if (supportedCodes.includes(code)) {
		for (const item of details) {
			if (!item) continue
			const field = item.field
			if (!errorsObj[field]) {
				const validationCode = item.validationCode || ''
				const value = item?.params?.value
				errorsObj[field] = { validationCode }
				if (value) errorsObj[field].value = value
			}
		}

		return Object.keys(errorsObj).length ? errorsObj : null
	}

	return { general: message }
}

export default serverErrorsFormatter
