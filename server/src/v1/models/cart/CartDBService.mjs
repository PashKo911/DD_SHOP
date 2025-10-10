import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import Cart from './Cart.mjs'
import mergeCarts from '../../../../utils/mergeCarts.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../constants/errorCodes.mjs'
import { buildPopulationPipeline } from '../../agregations/cart/buildPopulationPipeline.mjs'
import {
	cartProductFilter,
	productsFilter,
	pullUpdate,
	pushUpdate,
	updateSet,
	updateInc,
} from '../../agregations/cart/productUpdateConfig.mjs'

class CartDBService extends MongooseCRUDManager {
	async initCart(customer, cartItems) {
		try {
			const userCart = await super.findOne({ customer })

			if (!userCart) {
				if (!Array.isArray(cartItems) || cartItems.length === 0) {
					return { customer, productsList: [] }
				}

				const resCart = await super.create({ customer, productsList: cartItems })
				return resCart
			}

			const merged = mergeCarts(cartItems, userCart.productsList)
			userCart.productsList = merged
			const resCart = await userCart.save()

			return resCart.productsList
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to initialize cart (database error).', {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}

	async populateCart(cartData, userId, language, rate) {
		try {
			const pipeline = buildPopulationPipeline(cartData, userId, language, rate)

			const [populatedCart] = await Cart.aggregate(pipeline)

			return populatedCart
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(400, 'Failed to populate cart', { code: errorCodes.DATABASE_ERROR, cause: err })
		}
	}

	async addProduct({ userId, productId, variant, size, amount }) {
		try {
			let cart = await Cart.findOneAndUpdate(
				cartProductFilter(userId, productId, variant, size),
				updateInc(amount),
				{
					...productsFilter(productId, variant, size),
					new: true,
				}
			)
			if (cart) return cart.productsList

			cart = await Cart.findOneAndUpdate({ customer: userId }, pushUpdate(productId, variant, size, amount), {
				new: true,
			})

			return cart.productsList
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed add product to cart', {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}

	async updateProductAmount({ userId, productId, variant, size, amount, language, rate }) {
		try {
			const cart = await Cart.findOneAndUpdate(
				cartProductFilter(userId, productId, variant, size),
				updateSet(amount),
				{
					...productsFilter(productId, variant, size),
					new: true,
				}
			)

			if (!cart) {
				throw new HttpError(404, 'Cart not found', { code: errorCodes.NOT_FOUND })
			}

			const populatedCart = await this.populateCart(cart.productsList, userId, language, rate)

			return { productsList: cart.productsList, populatedCart }
		} catch (error) {
			throw error
		}
	}

	async deleteProduct({ userId, productId, variant, size, language, rate }) {
		try {
			const cart = await Cart.findOneAndUpdate({ customer: userId }, pullUpdate(productId, variant, size), {
				new: true,
			})

			if (!cart) {
				throw new HttpError(404, 'Cart not found', { code: errorCodes.NOT_FOUND })
			}

			let populatedCart = null
			if (cart.productsList?.length) {
				populatedCart = await this.populateCart(cart.productsList, userId, language, rate)
			}

			return { productsList: cart.productsList, populatedCart }
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

export default new CartDBService(Cart)
