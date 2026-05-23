import { validationResult } from 'express-validator'

import UsersDBService from '../models/user/UsersDBService.mjs'
import { exchangeCodeForTokens, verifyIdToken } from '../../../services/googleAuth.mjs'
import {
	issueTokenPair,
	revokeRefreshToken,
	rotateRefreshToken,
} from '../../../services/authTokenService.mjs'

import { normalizeExpressValidatorErrors } from '../../../utils/error/normalizeExpressValidatorErrors.mjs'
import {
	clearRefreshTokenCookie,
	getRefreshTokenFromRequest,
	setRefreshTokenCookie,
} from '../../../utils/auth/cookie.mjs'

import { HttpError } from '../../../errors/HttpError.mjs'
import { errorCodes } from '../../../constants/errorCodes.mjs'
import { validationErrorCodes } from '../../../constants/validationErrorCodes.mjs'
import { appConstants } from '../../../constants/app.mjs'

function sendAuthResponse(res, status, { accessToken, refreshToken, user }) {
	setRefreshTokenCookie(res, refreshToken)

	res.status(status).json({
		success: true,
		accessToken,
		user,
	})
}

class AuthController {
	static async signup(req, res, next) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const details = normalizeExpressValidatorErrors(expressErrors)
			return next(
				new HttpError(400, 'Validation failed', {
					code: errorCodes.VALIDATION_ERROR,
					details,
					expose: true,
				})
			)
		}

		try {
			const { email, password } = req.body

			let user = await UsersDBService.findOne({ email })

			if (user && !user.password && user.googleId) {
				user.password = password
				await user.save()
				user = await UsersDBService.getById(user._id)
			} else {
				const { _id } = await UsersDBService.create({ email, password })
				user = await UsersDBService.getById(_id)
			}

			const { _id, name, type } = user

			const { accessToken, refreshToken } = await issueTokenPair(
				{
					_id,
					email,
					name,
					type: type?.name || type,
				},
				req
			)

			sendAuthResponse(res, 201, {
				accessToken,
				refreshToken,
				user,
			})
		} catch (err) {
			next(err)
		}
	}

	static async signin(req, res, next) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const details = normalizeExpressValidatorErrors(expressErrors)
			return next(
				new HttpError(400, 'Validation failed', {
					code: errorCodes.VALIDATION_ERROR,
					details,
					expose: true,
				})
			)
		}

		try {
			const { email, password } = req.body
			const user = await UsersDBService.findOne({ email })

			if (!user) {
				return next(
					new HttpError(401, 'Invalid email or password', {
						code: errorCodes.UNAUTHORIZED,
						details: [
							{ field: appConstants.generalErrorField, validationCode: validationErrorCodes.CREDENTIALS },
						],
						expose: true,
					})
				)
			}

			if (user.googleId && !user.password) {
				return next(
					new HttpError(
						400,
						'This account does not support password sign-in, please try another sign-in method',
						{
							code: errorCodes.AUTH_METHOD_NOT_SUPPORTED,
							details: [
								{
									field: appConstants.generalErrorField,
									validationCode: validationErrorCodes.UNSUPPORTED_AUTH_METHOD,
									params: { value: appConstants.availableMethods },
								},
							],
							expose: true,
						}
					)
				)
			}

			if (!(await user.validPassword(password))) {
				return next(
					new HttpError(401, 'Invalid email or password', {
						code: errorCodes.UNAUTHORIZED,
						details: [
							{ field: appConstants.generalErrorField, validationCode: validationErrorCodes.CREDENTIALS },
						],
						expose: true,
					})
				)
			}

			const { _id, email: e, name, type } = user

			const { accessToken, refreshToken } = await issueTokenPair(
				{
					_id,
					email: e,
					name,
					type: type?.name || type,
				},
				req
			)

			sendAuthResponse(res, 200, {
				accessToken,
				refreshToken,
				user: {
					_id,
					email: e,
					name,
					type: type?.name || type,
				},
			})
		} catch (err) {
			next(err)
		}
	}

	static async authWithGoogle(req, res, next) {
		try {
			const { code } = req.body

			if (!code) {
				return next(
					new HttpError(400, 'Authentication code is required', {
						code: errorCodes.BAD_REQUEST,
						expose: true,
					})
				)
			}

			const tokenData = await exchangeCodeForTokens(code)

			if (!tokenData?.id_token) {
				return next(
					new HttpError(400, 'No id_token returned from Google', {
						code: errorCodes.BAD_REQUEST,
						expose: true,
					})
				)
			}

			const googleUserData = await verifyIdToken(tokenData.id_token)

			if (!googleUserData || !googleUserData.email) {
				return next(
					new HttpError(400, 'Invalid Google token', {
						code: errorCodes.BAD_REQUEST,
						expose: true,
					})
				)
			}

			let user = await UsersDBService.findOne({ googleId: googleUserData.sub })

			if (!user) {
				user = await UsersDBService.findOne({ email: googleUserData.email })
			}

			if (user) {
				user.googleId = googleUserData.sub
				if (!user.avatar) user.avatar = googleUserData.picture
				if (!user.name || user.name === appConstants.defaultUserName) user.name = googleUserData.name

				await user.save()
			} else {
				await UsersDBService.create({
					email: googleUserData.email,
					googleId: googleUserData.sub,
					avatar: googleUserData.picture,
					name: googleUserData.name,
				})

				user = await UsersDBService.findOne({ googleId: googleUserData.sub })
			}

			const { _id, email, avatar, name, type } = user
			const { accessToken, refreshToken } = await issueTokenPair(
				{
					_id,
					email,
					name,
					type: type?.name || type,
				},
				req
			)

			sendAuthResponse(res, 200, {
				accessToken,
				refreshToken,
				user: {
					_id,
					email,
					avatar,
					name,
					type: type?.name || type,
				},
			})
		} catch (err) {
			next(err)
		}
	}

	static async refresh(req, res, next) {
		try {
			const refreshToken = getRefreshTokenFromRequest(req)

			if (!refreshToken) {
				return res.status(200).json({
					success: true,
					data: { accessToken: null },
				})
			}

			const tokens = await rotateRefreshToken(refreshToken, req)

			console.log(tokens, 'tokens')

			if (!tokens) {
				clearRefreshTokenCookie(res)
				return next(
					new HttpError(401, 'Session expired', {
						code: errorCodes.NO_SESSION,
						expose: true,
					})
				)
			}

			setRefreshTokenCookie(res, tokens.refreshToken)

			return res.status(200).json({
				success: true,
				data: {
					accessToken: tokens.accessToken,
				},
			})
		} catch (err) {
			clearRefreshTokenCookie(res)
			return next(err)
		}
	}

	static async logout(req, res, next) {
		try {
			const refreshToken = getRefreshTokenFromRequest(req)

			await revokeRefreshToken(refreshToken)
			clearRefreshTokenCookie(res)

			res.status(200).json({
				success: true,
				message: 'Logged out successfully',
			})
		} catch (err) {
			next(err)
		}
	}

	static async getProfile(req, res, next) {
		try {
			const user = await UsersDBService.getById(req.user._id)

			if (!user) {
				return next(
					new HttpError(404, 'User not found', {
						code: errorCodes.NOT_FOUND,
						expose: true,
					})
				)
			}

			res.status(200).json({
				success: true,
				user,
			})
		} catch (err) {
			next(err)
		}
	}
}

export default AuthController
