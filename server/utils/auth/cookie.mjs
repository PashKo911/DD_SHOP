import { authConstants } from '../../constants/auth.mjs'
import { convertDuration } from '../time/convertDuration.mjs'
import { config } from '../../config/default.mjs'

function buildRefreshCookieBaseOptions() {
	console.log(config.cookieSecure, 'secure: config.cookieSecure,')
	console.log(config.cookieSameSite, 'sameSite: config.cookieSameSite,')
	console.log(authConstants.refreshCookiePath, 'path: authConstants.refreshCookiePath,')
	console.log(config.isProduction, 'isProduction')

	return {
		httpOnly: true,
		secure: config.cookieSecure,
		sameSite: config.cookieSameSite,
		path: authConstants.refreshCookiePath,
	}
}

export function getRefreshCookieOptions() {
	return {
		...buildRefreshCookieBaseOptions(),
		maxAge: convertDuration(config.refreshTokenExpiresIn),
	}
}

export function setRefreshTokenCookie(res, refreshToken) {
	res.cookie(authConstants.refreshTokenCookieName, refreshToken, getRefreshCookieOptions())
}

export function clearRefreshTokenCookie(res) {
	res.clearCookie(authConstants.refreshTokenCookieName, buildRefreshCookieBaseOptions())
}

export function getRefreshTokenFromRequest(req) {
	return req.cookies?.[authConstants.refreshTokenCookieName] || null
}
