import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import FormatValidationErrors from '../../../validators/formatValidationErrors.mjs'
import UsersDBService from '../models/user/UsersDBService.mjs'
import TypesDBService from '../models/type/TypesDBService.mjs'
import { prepareToken } from '../../../utils/jwtHelpers.mjs'
import CartDBService from '../models/cart/CartDBService.mjs'

class AuthController {
	static async signup(req, res) {
		const newUser = req.body
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const errors = FormatValidationErrors.formatExpressErrors(expressErrors)
			return res.status(400).json({ errors })
		}

		try {
			const user = await UsersDBService.create(newUser)

			// const guestId = req.headers['x-guest-id']

			// const cart = await CartDBService.transferGuestCartToUser(guestId, user._id.toString())

			const { token, expireInMs } = prepareToken({ _id: user._id, username: user.name }, req.headers)

			return res.status(201).json({
				result: 'Signed up successfully',
				token,
				expireInMs,
				// user: {
				// 	name: user.name,
				// 	type: user.type,
				// },
				// cart,
			})
		} catch (error) {
			console.error(error)
			const errors = FormatValidationErrors.formatMongooseErrors(error.message, 'User')
			res.status(400).json({ errors })
		}
	}

	static async login(req, res) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const errors = FormatValidationErrors.formatExpressErrors(expressErrors)
			return res.status(400).json({ errors })
		}

		try {
			const user = await UsersDBService.findOne({ email: req.body.email })

			if (!user || !(await user.validPassword(req.body.password))) {
				return res.status(401).json({ errors: [{ message: 'Invalid email or password' }] })
			}
			// const guestId = req.headers['x-guest-id']

			// const cart = await CartDBService.transferGuestCartToUser(guestId, user._id.toString())
			const { token, expireInMs } = prepareToken({ id: user._id, username: user.username }, req.headers)

			res.json({
				result: 'Authorized',
				token,
				expireInMs,
				// user: {
				// 	name: user.name,
				// 	type: user.type,
				// },
				// cart,
			})
		} catch (error) {
			console.error(error)
			const errors = FormatValidationErrors.formatMongooseErrors(error.message, 'User')
			res.status(401).json({ errors })
		}
	}

	// static async setGuest(req, res) {
	// 	try {
	// 		let guest
	// 		let isNewGuest = false

	// 		const guestId = req.headers['x-guest-id']

	// 		if (!guestId) {
	// 			guest = await UsersDBService.create({
	// 				email: `guest-${uuidv4()}@example.com`,
	// 				password: '',
	// 			})
	// 			isNewGuest = true
	// 		} else {
	// 			guest = await UsersDBService.getById(guestId)

	// 			if (!guest) {
	// 				return res.status(404).json({ message: 'Guest not found' })
	// 			}
	// 		}

	// 		const userType = await TypesDBService.getById(guest.type)

	// 		return res.status(isNewGuest ? 201 : 200).json({
	// 			id: guest._id.toString(),
	// 			type: userType,
	// 		})
	// 	} catch (error) {
	// 		console.error('Error initializing guest:', error)
	// 		return res.status(500).json({ message: 'Error initializing guest' })
	// 	}
	// }
}

export default AuthController
