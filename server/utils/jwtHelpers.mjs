import jwt from 'jsonwebtoken'
import { config } from '../config/default.mjs'

const expiresIn = config.expiredTime
const tokenKey = config.tokenKey

/**
 * Parse and verify Bearer JWT token
 * @param {string} bearer - Authorization header value
 * @returns {object} decoded payload
 * @throws {Error} if token is invalid or expired
 */
export function parseBearer(bearer) {
	let token
	if (bearer.startsWith('Bearer ')) {
		token = bearer.slice(7)
	}
	try {
		return jwt.verify(token, tokenKey)
	} catch {
		throw new Error('Invalid token')
	}
}

/**
 * Generate a signed JWT token
 * @param {object} data - Payload to sign
 * @returns {{token: string, expireInMs: number}}
 */
export function prepareToken(data) {
	const token = jwt.sign(data, tokenKey, { expiresIn })
	const expireInMs = convertDuration(expiresIn)
	return { token, expireInMs }
}

/**
 * Convert duration string to milliseconds
 * @param {string} durationStr - e.g. "10m", "2h", "7d"
 * @returns {number} duration in ms
 * @throws {Error} if format is invalid
 */
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
