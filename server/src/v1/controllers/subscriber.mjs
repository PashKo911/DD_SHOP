import { errorCodes } from '../../../constants/errorCodes.mjs'
import SubscribersDBService from '../models/subscriber/SubscribersDBService.mjs'
import { HttpError } from '../../../errors/HttpError.mjs'
import { validationResult } from 'express-validator'
import { normalizeExpressValidatorErrors } from '../../../utils/errorNormalizers/normalizeExpressValidatorErrors.mjs'

class SubscriberController {
	static async createSubscriber(req, res, next) {
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
			const { email } = req.body
			await SubscribersDBService.create({ email })

			res.status(201).json({
				success: true,
				message: 'Subscription successful',
			})
		} catch (err) {
			next(err)
		}
	}
}

export default SubscriberController
