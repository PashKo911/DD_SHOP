import { errorCodes } from '../constants/errorCodes.mjs'

export class HttpError extends Error {
	/**
	 * @param {number} status HTTP status code
	 * @param {string} message user-friendly message
	 * @param {Object} [options]
	 *  - code: internal machine-readable code e.g. VALIDATION_ERROR
	 *  - details: extra structured details (array/object)
	 *  - expose: boolean - Can I show message/details client
	 *  - cause: original error
	 */
	constructor(status = 500, message = 'Internal Server Error', options = {}) {
		const {
			code = errorCodes.INTERNAL_ERROR,
			details = undefined,
			expose = false,
			cause = undefined,
		} = options
		super(message)
		this.name = 'HttpError'
		this.status = status
		this.code = code
		this.details = details
		this.expose = expose
		if (cause) this.cause = cause
		Error.captureStackTrace(this, this.constructor)
	}
}
