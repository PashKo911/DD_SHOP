import { errorCodes } from '../../constants/errorCodes.mjs'

/**
 * Normalizes OAuth/OIDC errors.
 * Provides a consistent structure regardless of whether
 * the error comes from google-auth-library, fetch, or a plain Error.
 *
 * @param {any} err
 * @returns {{ code: string, message: string, status?: number, details?: any }}
 */

export function normalizeOAuthError(err) {
	if (!err) {
		return {
			code: errorCodes.OAUTH_UNKNOWN_ERROR,
			message: 'Unexpected error',
		}
	}

	if (err.response && typeof err.response === 'object') {
		const { status, data } = err.response
		return {
			code: (data?.error && data?.error.toUpperCase()) || errorCodes.OAUTH_TOKEN_ERROR,
			message: data?.error_description || 'Error while requesting token',
			status,
			details: data,
		}
	}

	if (err instanceof Response) {
		return {
			code: errorCodes.OAUTH_HTTP_ERROR,
			message: `HTTP ${err.status} during OAuth request`,
			status: err.status,
		}
	}

	if (err instanceof Error) {
		return {
			code: errorCodes.OAUTH_GENERAL_ERROR ?? errorCodes.OAUTH_ERROR,
			message: err.message,
		}
	}

	if (typeof err === 'object' && (err.error || err.error_description)) {
		return {
			code: (err.error || errorCodes.OAUTH_ERROR).toUpperCase(),
			message: err.error_description || 'Authorization error',
			details: err,
		}
	}

	return {
		code: errorCodes.OAUTH_UNKNOWN_ERROR,
		message: String(err),
	}
}
