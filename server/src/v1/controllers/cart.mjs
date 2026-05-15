import { HttpError } from '../../../errors/HttpError.mjs'
import CartDBService from '../models/cart/CartDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'
import { resolveLocale } from '../../../utils/resolveLocale.mjs'
import { getRate } from '../../../services/ratesCache.mjs'
import { appConstants } from '../../../constants/app.mjs'
import { errorCodes } from '../../../constants/errorCodes.mjs'
import { normalizeExpressValidatorErrors } from '../../../utils/errorNormalizers/normalizeExpressValidatorErrors.mjs'
import cartProductSchema from '../../../validators/cartProductSchema.mjs'
import { validationResult, checkSchema } from 'express-validator'

class CartController {
	static async initCart(req, res, next) {
		try {
			const userId = req.user?._id || null
			const cartData = Array.isArray(req.body) ? req.body : []

			const cart = await CartDBService.initCart(userId, cartData)

			res.status(200).json({ success: true, cart })
		} catch (err) {
			next(err)
		}
	}
	static async populateCart(req, res, next) {
		try {
			const userId = req.user?._id || null
			const cartData = Array.isArray(req.body) ? req.body : []
			const language = resolveLocale(req)
			const currency = req.headers.currency || appConstants.defaultCurrency

			if (!cartData.length) {
				return res.status(200).json({
					success: true,
					populatedCart: {
						productsList: [],
						productCount: 0,
						total: 0,
						totalDiscount: 0,
						totalWithoutDiscount: 0,
					},
				})
			}

			const rate = await getRate(currency)

			const populatedCart = await CartDBService.populateCart(cartData, userId, language, rate)

			res.status(200).json({
				success: true,
				populatedCart,
			})
		} catch (err) {
			next(err)
		}
	}
	static async addProduct(req, res, next) {
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
			const userId = req.user?._id || null
			const { product: productId, variant, size, quantity } = req.body

			const productDb = await ProductsDBService.getById(productId)

			if (!productDb) {
				throw new HttpError(404, 'Product not found', { code: errorCodes.NOT_FOUND })
			}

			const productsList = await CartDBService.addProduct({
				userId,
				productId,
				variant,
				size,
				quantity,
			})

			res.status(200).json({ message: 'Product added successfully', cart: productsList })
		} catch (err) {
			next(err)
		}
	}
	static async updateProductQuantity(req, res, next) {
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
			const userId = req.user?._id || null
			const { product: productId, variant, size, quantity } = req.body

			const language = resolveLocale(req)
			const currency = req.headers.currency || appConstants.defaultCurrency

			const rate = await getRate(currency)

			const productDb = await ProductsDBService.getById(productId)

			if (!productDb) {
				throw new HttpError(404, 'Product not found', { code: errorCodes.NOT_FOUND })
			}

			const { productsList, populatedCart } = await CartDBService.updateProductQuantity({
				userId,
				productId,
				variant,
				size,
				quantity,
				language,
				rate,
			})

			res
				.status(200)
				.json({ message: 'Product quantity updated successfully', cart: productsList, populatedCart })
		} catch (err) {
			next(err)
		}
	}
	static async deleteProduct(req, res, next) {
		await Promise.all(
			['product', 'variant', 'size'].map((field) =>
				checkSchema({ [field]: cartProductSchema[field] }).run(req)
			)
		)

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const details = normalizeExpressValidatorErrors(errors)
			return next(
				new HttpError(400, 'Validation failed', {
					code: errorCodes.VALIDATION_ERROR,
					details,
					expose: true,
				})
			)
		}

		try {
			const userId = req.user?._id || null
			const { product: productId, variant, size } = req.body

			const language = resolveLocale(req)
			const currency = req.headers.currency || appConstants.defaultCurrency

			const rate = await getRate(currency)

			const { productsList, populatedCart } = await CartDBService.deleteProduct({
				userId,
				productId,
				variant,
				size,
				language,
				rate,
			})

			res.status(200).json({ message: 'Product deleted', cart: productsList, populatedCart })
		} catch (err) {
			next(err)
		}
	}
}

export default CartController
