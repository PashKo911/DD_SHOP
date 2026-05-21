import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { config } from '../../config/default.mjs'
import { errorCodes } from '../../constants/errorCodes.mjs'
import { convertDuration } from '../time/convertDuration.mjs'

/**
 * Parse and verify Bearer JWT access token
 * @param {string} bearer - Authorization header value
 * @returns {object} decoded payload
 */

const BEARER_PREFIX = 'Bearer '

export function parseBearer(bearer) {
	if (!bearer || typeof bearer !== 'string' || !bearer.startsWith(BEARER_PREFIX)) {
		const err = new Error('Missing token')
		err.code = errorCodes.UNAUTHORIZED
		throw err
	}

	const token = bearer.slice(BEARER_PREFIX.length)

	try {
		return jwt.verify(token, config.accessTokenKey)
	} catch (cause) {
		const err = new Error('Invalid token')
		err.cause = cause
		err.code = cause?.name === 'TokenExpiredError' ? errorCodes.INVALID_ACCESS_TOKEN : errorCodes.UNAUTHORIZED
		throw err
	}
}

export function prepareAccessToken(data) {
	const accessToken = jwt.sign(data, config.accessTokenKey, {
		expiresIn: config.accessTokenExpiresIn,
	})
	const expireInMs = convertDuration(config.accessTokenExpiresIn)
	return { accessToken, expireInMs }
}

export function hashToken(token) {
	return crypto.createHash('sha256').update(token).digest('hex')
}
