import { errorCodes } from '../constants/errorCodes.mjs'
import { parseBearer } from '../utils/jwtHelpers.mjs'
import { HttpError } from '../errors/HttpError.mjs'

export const attachUserFromBarrier = (req, res, next) => {
	try {
		const user = parseBearer(req.headers.authorization)
		req.user = user
	} catch (err) {
		req.user = null
	}
	next()
}

export const checkAuth = (req, res, next) => {
	try {
		const user = parseBearer(req.headers.authorization)
		req.user = user
		next()
	} catch (err) {
		return next(
			new HttpError(401, 'Invalid or missing token', {
				cause: err,
				code: errorCodes.UNAUTHORIZED,
				details: [{ field: 'token', message: 'Invalid or missing token' }],
			})
		)
	}
}

export function checkAdmin(req, res, next) {
	if (!req.user || req.user.type.name !== 'admin') {
		return next(
			new HttpError(403, 'Access denied', {
				code: errorCodes.FORBIDDEN,
			})
		)
	}
	next()
}
