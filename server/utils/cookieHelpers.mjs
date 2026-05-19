import { authConstants } from '../constants/auth.mjs'
import { convertDuration } from './jwtHelpers.mjs'
import { config } from '../config/default.mjs'

export function getRefreshCookieOptions() {
	const maxAge = convertDuration(config.refreshTokenExpiresIn)

	return {
		httpOnly: true,
		secure: config.cookieSecure,
		sameSite: config.cookieSameSite,
		path: authConstants.refreshCookiePath,
		maxAge,
	}
}

export function setRefreshTokenCookie(res, refreshToken) {
	res.cookie(authConstants.refreshTokenCookieName, refreshToken, getRefreshCookieOptions())
}

export function clearRefreshTokenCookie(res) {
	res.clearCookie(authConstants.refreshTokenCookieName, {
		httpOnly: true,
		secure: config.cookieSecure,
		sameSite: config.cookieSameSite,
		path: authConstants.refreshCookiePath,
	})
}

export function getRefreshTokenFromRequest(req) {
	return req.cookies?.[authConstants.refreshTokenCookieName] || null
}
