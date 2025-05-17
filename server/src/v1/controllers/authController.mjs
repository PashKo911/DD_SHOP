import { validationResult } from 'express-validator'
import FormatValidationErrors from '../../../validators/formatValidationErrors.mjs'
import UsersDBService from '../models/user/UsersDBService.mjs'
import { prepareToken } from '../../../utils/jwtHelpers.mjs'

class AuthController {
	static async signup(req, res) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const error = FormatValidationErrors.formatExpressErrors(expressErrors)
			return res.status(400).json({
				message: 'Validation failed',
				error,
			})
		}
		try {
			const newUser = {
				...req.body,
				username: req.body.username.toLowerCase(),
			}
			const { id, username, role } = await UsersDBService.createAndReturnUser(newUser)

			const { token } = prepareToken({ id, username, role }, req.headers)

			res.status(201).json({
				result: 'Signed up successfully',
				token,
				user: {
					id,
					username,
					role,
				},
			})
		} catch (err) {
			console.error(err)
			const error = FormatValidationErrors.formatMongooseErrors(err.message, 'User')
			res.status(400).json({
				message: 'Registration unsuccessful',
				error,
			})
		}
	}

	static async signin(req, res) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const error = FormatValidationErrors.formatExpressErrors(expressErrors)
			return res.status(400).json({
				message: 'Validation failed',
				error,
			})
		}

		try {
			const user = await UsersDBService.findOne({ username: req.body.username.toLowerCase() })

			if (!user || !(await user.validPassword(req.body.password))) {
				return res.status(401).json({ error: [{ message: 'Invalid username or password' }] })
			}

			const { id, username, role } = user

			const { token } = prepareToken({ id, username, role }, req.headers)

			res.json({
				result: 'Authorized',
				token,
				user: {
					id,
					username,
					role,
				},
			})
		} catch (err) {
			console.error(err)
			const error = FormatValidationErrors.formatMongooseErrors(err.message, 'User')
			res.status(400).json({
				message: 'Authentication unsuccessful',
				error,
			})
		}
	}

	static async getProfile(req, res) {
		try {
			const user = await UsersDBService.findOne({ username: req.user.username })

			if (!user) {
				return res.status(401).json({ message: 'Invalid credentials' })
			}

			const { id, username, role } = user
			const { token } = prepareToken({ id, username, role }, req.headers)

			res.json({
				token,
				user: {
					id,
					username,
					role,
				},
			})
		} catch (err) {
			console.error(err)
			const error = FormatValidationErrors.formatMongooseErrors(err.message, 'User')
			res.status(400).json({
				message: 'Internal server error:',
				error,
			})
		}
	}
}

export default AuthController
