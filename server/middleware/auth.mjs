import { errorCodes } from '../constants/errorCodes.mjs'
import { parseBearer } from '../utils/auth/jwt.mjs'
import { HttpError } from '../errors/HttpError.mjs'

export const attachUserFromBarrier = (req, res, next) => {
	try {
		const user = parseBearer(req.headers.authorization)
		req.user = user
	} catch {
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
				code: err.code || errorCodes.UNAUTHORIZED,
				details: [{ field: 'token', message: 'Invalid or missing token' }],
				expose: true,
			})
		)
	}
}

export const allowTypes = (...allowedTypes) => {
	return (req, res, next) => {
		if (!req.user) {
			return next(
				new HttpError(401, 'Unauthorized', {
					code: errorCodes.UNAUTHORIZED,
					expose: true,
				})
			)
		}

		const userType = req.user.type?.name || req.user.type

		if (!allowedTypes.includes(userType)) {
			return next(
				new HttpError(403, 'Access denied', {
					code: errorCodes.FORBIDDEN,
					expose: true,
				})
			)
		}

		next()
	}
}
