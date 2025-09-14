import { HttpError } from '../../errors/HttpError.mjs'
import { errorCodes } from '../../config/errorCodes.mjs'
import { validationErrorCodes } from '../../config/validationErrorCodes.mjs'

/**
 * Build an array of field-specific details from a Mongoose ValidationError.
 *
 * Converts Mongoose error object to an array of objects: { field, validationCode, params, message }.
 * Useful for sending standardized error details to the client.
 *
 * @param {import('mongoose').Error.ValidationError} mongooseValidationError - Mongoose validation error object
 * @returns {Array<{ field: string, validationCode: string, params?: Record<string, any>, message?: string }>} Array of validation details
 */
const buildValidationDetails = (mongooseValidationError) => {
	return Object.entries(mongooseValidationError.errors).map(([field, err]) => ({
		field,
		validationCode: err.validationCode || validationErrorCodes.INVALID,
		params: err.params || {},
		message: err.message, // optional fallback
	}))
}

/**
 * Normalize different types of errors into a consistent response format for API clients.
 *
 * @param {Error|object} err - The original error object thrown in your application
 * @returns {{
 *   status: number,
 *   body: {
 *     success: false,
 *     error: {
 *       code: string,
 *       message: string,
 *       details?: Array<{field?: string, validationCode?: string, params?: Record<string, any>, message?: string}>
 *     }
 *   },
 *   logLevel: 'warn' | 'error'
 * }}
 */
export function normalizeError(err) {
	if (!err) {
		return {
			status: 500,
			body: { success: false, error: { code: errorCodes.INTERNAL_ERROR, message: 'Internal Server Error' } },
			logLevel: 'error',
		}
	}

	const isPlainObject = typeof err === 'object' && !(err instanceof Error)
	const original = isPlainObject ? Object.assign(new Error(err.message || 'Error'), err) : err

	// HttpError
	if (original.name === 'HttpError' || original instanceof HttpError) {
		const status = Number.isInteger(original.status) ? original.status : 500
		const expose = Boolean(original.expose)
		const message = expose
			? original.message || 'Error'
			: status >= 500
			? 'Internal Server Error'
			: original.message || 'Error'

		const body = {
			success: false,
			error: {
				code: original.code || errorCodes.INTERNAL_ERROR,
				message,
				...(original.details ? { details: original.details } : {}),
			},
		}
		return { status, body, logLevel: status >= 500 ? 'error' : 'warn' }
	}

	// Explicit status
	if (original.status && Number.isInteger(original.status)) {
		const status = original.status
		const expose = Boolean(original.expose)
		const message = expose
			? original.message || 'Error'
			: status >= 500
			? 'Internal Server Error'
			: original.message || 'Error'
		const body = {
			success: false,
			error: {
				code: original.code || (status === 404 ? errorCodes.NOT_FOUND : errorCodes.INTERNAL_ERROR),
				message,
				...(original.details ? { details: original.details } : {}),
			},
		}
		return { status, body, logLevel: status >= 500 ? 'error' : 'warn' }
	}

	// Mongoose validation
	if (original.name === 'ValidationError' && original.errors) {
		const details = buildValidationDetails(original)
		const body = {
			success: false,
			error: { code: errorCodes.VALIDATION_ERROR, message: 'Incorrect data', details },
		}
		return { status: 400, body, logLevel: 'warn' }
	}

	// Mongoose cast error
	if (original.name === 'CastError') {
		const field = original.path || 'id'
		const value = original.value
		const body = {
			success: false,
			error: {
				code: errorCodes.CAST_ERROR,
				message: `Incorrect field value "${field}"`,
				details: [{ field, validationCode: 'invalid', params: { value } }],
			},
		}
		return { status: 400, body, logLevel: 'warn' }
	}

	// Duplicate key
	if (original.code && (original.code === 11000 || original.code === 11001)) {
		const keyValue = original.keyValue || {}
		const field = Object.keys(keyValue)[0] || 'unknown'
		const value = keyValue[field]
		const body = {
			success: false,
			error: {
				code: errorCodes.DUPLICATE_KEY,
				message: `Value for the field "${field}" already exists`,
				details: [{ field, validationCode: validationErrorCodes.DUPLICATE, params: { value } }],
			},
		}
		return { status: 409, body, logLevel: 'warn' }
	}

	// JWT errors
	if (original.name === 'JsonWebTokenError' || original.name === 'TokenExpiredError') {
		return {
			status: 401,
			body: { success: false, error: { code: errorCodes.UNAUTHORIZED, message: 'Unauthorized' } },
			logLevel: 'warn',
		}
	}

	// Fallback
	return {
		status: 500,
		body: { success: false, error: { code: errorCodes.INTERNAL_ERROR, message: 'Internal Server Error' } },
		logLevel: 'error',
	}
}
