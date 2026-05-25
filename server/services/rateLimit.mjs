import rateLimit from 'express-rate-limit'

import { HttpError } from '../errors/HttpError.mjs'
import { errorCodes } from '../constants/errorCodes.mjs'

export const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
})

export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,

	handler: (req, res, next) => {
		next(new HttpError(429, 'Too many requests, please try again later', errorCodes.RATE_LIMITED))
	},
})
