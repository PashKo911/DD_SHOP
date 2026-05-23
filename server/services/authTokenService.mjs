import crypto from 'crypto'

import { config } from '../config/default.mjs'
import { errorCodes } from '../constants/errorCodes.mjs'
import { HttpError } from '../errors/HttpError.mjs'
import { hashToken, prepareAccessToken } from '../utils/auth/jwt.mjs'
import { convertDuration } from '../utils/time/convertDuration.mjs'
import RefreshTokenDBService from '../src/v1/models/refreshToken/RefreshTokenDBService.mjs'
import UsersDBService from '../src/v1/models/user/UsersDBService.mjs'

function generateRefreshToken() {
	return crypto.randomBytes(64).toString('hex')
}

async function persistRefreshToken(userId, refreshToken, req) {
	const tokenHash = hashToken(refreshToken)
	const expiresAt = new Date(Date.now() + convertDuration(config.refreshTokenExpiresIn))

	await RefreshTokenDBService.create({
		userId,
		tokenHash,
		expiresAt,
		userAgent: req.headers['user-agent'],
		ip: req.ip,
	})

	return refreshToken
}

export async function issueTokenPair(userPayload, req) {
	const { accessToken } = prepareAccessToken(userPayload)
	const refreshToken = generateRefreshToken()

	await persistRefreshToken(userPayload._id, refreshToken, req)

	return { accessToken, refreshToken }
}

export async function rotateRefreshToken(refreshToken, req) {
	if (!refreshToken) {
		throw new HttpError(401, 'Refresh token is required', {
			code: errorCodes.INVALID_REFRESH_TOKEN,
			expose: true,
		})
	}

	const tokenHash = hashToken(refreshToken)
	const storedToken = await RefreshTokenDBService.findValidByHash(tokenHash)

	console.log(storedToken, 'await RefreshTokenDBService.findValidByHash(tokenHash)')
	if (!storedToken) {
		const existingToken = await RefreshTokenDBService.findByHash(tokenHash)

		if (existingToken?.revokedAt) {
			console.log('await RefreshTokenDBService.revokeAllForUser(existingToken.userId)')
			await RefreshTokenDBService.revokeAllForUser(existingToken.userId)
		}

		throw new HttpError(401, 'Invalid or expired refresh token', {
			code: errorCodes.INVALID_REFRESH_TOKEN,
			expose: true,
		})
	}

	await RefreshTokenDBService.revokeById(storedToken._id)

	const user = await UsersDBService.getById(storedToken.userId, {}, ['type'])

	if (!user) {
		throw new HttpError(401, 'User not found', {
			code: errorCodes.INVALID_REFRESH_TOKEN,
			expose: true,
		})
	}

	const { _id, email, name, type } = user

	return issueTokenPair({ _id, email, name, type }, req)
}

export async function revokeRefreshToken(refreshToken) {
	if (!refreshToken) return

	const tokenHash = hashToken(refreshToken)
	await RefreshTokenDBService.revokeByHash(tokenHash)
}
