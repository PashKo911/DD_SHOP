import { OAuth2Client } from 'google-auth-library'
import { config } from '../config/default.mjs'
import { normalizeOAuthError } from '../utils/errorNormalizers/normalizeOAuthError.mjs'
import { errorCodes } from '../constants/errorCodes.mjs'
import { HttpError } from '../errors/HttpError.mjs'

const { googleClientId, googleClientSecret, googleRedirectUri } = config

/**
 * Creates a new OAuth2Client for each operation
 * to avoid race conditions in parallel requests
 *
 * @returns {OAuth2Client}
 */
function createOauthClient() {
	return new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri)
}

/**
 * Exchanges an authorization code for tokens.
 * Returns tokens = { access_token, id_token, refresh_token, expiry_date? ... }
 *
 * @param {string} code
 * @returns {Promise<Object>}
 */
export async function exchangeCodeForTokens(code) {
	const client = createOauthClient()
	try {
		const { tokens } = await client.getToken(code)
		return tokens
	} catch (err) {
		const oauthErr = normalizeOAuthError(err)

		throw new HttpError(oauthErr.status || 502, oauthErr.message, {
			code: oauthErr.code,
			details: oauthErr.details,
			cause: err,
			expose: true,
		})
	}
}

/**
 * Verifies an ID token using google-auth-library.
 * Returns the payload (sub, email, etc.)
 *
 * @param {string} idToken
 * @returns {Promise<Object>}
 */

export async function verifyIdToken(idToken) {
	const client = createOauthClient()
	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: googleClientId,
		})
		const payload = ticket.getPayload()

		if (!payload) {
			throw new HttpError(400, 'ID token payload is empty', {
				code: errorCodes.OAUTH_ERROR,
				expose: true,
			})
		}
		return payload
	} catch (err) {
		const oauthErr = normalizeOAuthError(err)

		throw new HttpError(oauthErr.status || 401, oauthErr.message, {
			code: oauthErr.code,
			details: oauthErr.details,
			cause: err,
		})
	}
}
