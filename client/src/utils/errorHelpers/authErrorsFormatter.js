import { errorCodes } from '@/config/errorCodes'
/**
 * Formats auth errors from server response.
 *
 * @param {object} error - Axios error object.
 * @returns {object|null} - e.g. { email: { validationCode: 'invalid' } }
 *                          or { email: { validationCode: '', value: 'test@mail.com' } }
 */

function authErrorsFormatter(error) {
	if (!error) return null
	const supportedCodes = [
		errorCodes.DUPLICATE_KEY,
		errorCodes.VALIDATION_ERROR,
		errorCodes.AUTH_METHOD_NOT_SUPPORTED,
		errorCodes.UNAUTHORIZED,
	]
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
			const validationCode = item.validationCode || ''
			const value = item?.params?.value || null

			errorsObj[field] = { validationCode }
			if (value) errorsObj[field].value = value
		}

		return Object.keys(errorsObj).length ? errorsObj : null
	}

	errorsObj.general = message

	return errorsObj
}

export default authErrorsFormatter
