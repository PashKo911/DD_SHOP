import rateLimit from 'express-rate-limit'

import { HttpError } from '../errors/HttpError.mjs'
import { errorCodes } from '../constants/errorCodes.mjs'
import { convertDuration } from '../utils/time/convertDuration.mjs'

export const apiRateLimiter = rateLimit({
	windowMs: convertDuration('15m'),
	max: 2000,
	standardHeaders: true,
	legacyHeaders: false,
})

export const authRateLimiter = rateLimit({
	windowMs: convertDuration('15m'),
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,

	handler: (req, res, next) => {
		next(new HttpError(429, 'Too many requests, please try again later', errorCodes.RATE_LIMITED))
	},
})

export const refreshRateLimiter = rateLimit({
	windowMs: convertDuration('1m'),
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
})
