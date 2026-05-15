import { validationResult } from 'express-validator'
import { normalizeExpressValidatorErrors } from '../../../utils/errorNormalizers/normalizeExpressValidatorErrors.mjs'
import UsersDBService from '../models/user/UsersDBService.mjs'
import { prepareToken } from '../../../utils/jwtHelpers.mjs'
import { appConstants } from '../../../constants/app.mjs'
import { exchangeCodeForTokens, verifyIdToken } from '../../../services/googleAuth.mjs'
import { HttpError } from '../../../errors/HttpError.mjs'
import { errorCodes } from '../../../constants/errorCodes.mjs'
import { validationErrorCodes } from '../../../constants/validationErrorCodes.mjs'

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

			let user
			user = await UsersDBService.findOne({ email })

			if (user && !user.password && user.googleId) {
				user.password = password
				await user.save()
				user = await UsersDBService.getById(user._id)
			} else {
				const { _id } = await UsersDBService.create({ email, password })
				user = await UsersDBService.getById(_id)
			}

			const { _id, email: e, name } = user

			const { token } = prepareToken({ _id, email: e, name }, req.headers)

			res.status(201).json({
				success: true,
				message: 'User registered successfully',
				token,
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

			const { token } = prepareToken({ _id, email: e, name }, req.headers)

			res.status(200).json({
				success: true,
				token,
				user: {
					_id,
					email: e,
					name,
					type,
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
					new HttpError(400, 'Invalid Google token', { code: errorCodes.BAD_REQUEST, expose: true })
				)
			}

			let user = await UsersDBService.findOne({ googleId: googleUserData.sub })

			if (!user) user = await UsersDBService.findOne({ email: googleUserData.email })

			if (user) {
				user.googleId = googleUserData.sub
				if (!user.avatar) user.avatar = googleUserData.picture
				if (!user.name || user.name === appConstants.defaultUserName) user.name = googleUserData.name

				await user.save()
			} else {
				const newUser = {
					email: googleUserData.email,
					googleId: googleUserData.sub,
					avatar: googleUserData.picture,
					name: googleUserData.name,
				}
				await UsersDBService.create(newUser)
				user = await UsersDBService.findOne({ googleId: googleUserData.sub })
			}

			const { _id, email, avatar, type, name } = user
			const { token } = prepareToken({ _id, email, name }, req.headers)

			res.status(200).json({
				success: true,
				token,
				user: {
					_id,
					email,
					avatar,
					type,
					name,
				},
			})
		} catch (err) {
			next(err)
		}
	}

	static async getProfile(req, res, next) {
		try {
			const user = await UsersDBService.getById(req.user._id)

			if (!user) {
				return next(new HttpError(404, 'User not found', { code: errorCodes.NOT_FOUND, expose: true }))
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
