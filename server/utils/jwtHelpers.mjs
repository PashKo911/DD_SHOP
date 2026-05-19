import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { config } from '../config/default.mjs'
import { errorCodes } from '../constants/errorCodes.mjs'

/**
 * Parse and verify Bearer JWT access token
 * @param {string} bearer - Authorization header value
 * @returns {object} decoded payload
 */
export function parseBearer(bearer) {
	if (!bearer || typeof bearer !== 'string' || !bearer.startsWith('Bearer ')) {
		const err = new Error('Missing token')
		err.code = errorCodes.UNAUTHORIZED
		throw err
	}

	const token = bearer.slice(7)

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

export function convertDuration(durationStr) {
	const timePattern = /^(\d+)([mhdwMy])$/
	const match = durationStr.match(timePattern)

	if (!match) {
		throw new Error('Invalid time format')
	}

	const value = parseInt(match[1], 10)
	const unit = match[2]

	switch (unit) {
		case 'm':
			return value * 60 * 1000
		case 'h':
			return value * 60 * 60 * 1000
		case 'd':
			return value * 24 * 60 * 60 * 1000
		case 'w':
			return value * 7 * 24 * 60 * 60 * 1000
		case 'M':
			return value * 30.44 * 24 * 60 * 60 * 1000
		case 'y':
			return value * 365.25 * 24 * 60 * 60 * 1000
		default:
			throw new Error('Invalid time unit')
	}
}
