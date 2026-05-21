import { authConstants } from '../../constants/auth.mjs'
import { convertDuration } from '../time/convertDuration.mjs'
import { config } from '../../config/default.mjs'

function buildRefreshCookieBaseOptions() {
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
