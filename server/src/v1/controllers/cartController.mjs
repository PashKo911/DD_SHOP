import CartDBService from '../models/cart/CartDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'

class CartController {
	static async getCartDetails(req, res, next) {
		try {
			const userId = req.user.id // Отримання id користувача

			const cartDetails = await CartDBService.getCartDetails(userId)
			res.status(200).json(
				cartDetails
				// user: req.user,
			)
		} catch (err) {
			next(err)
		}
	}
	static async addProduct(req, res, next) {
		// const userId = req.user.id

		try {
			console.log(req.body, 'addProduct ++++++++++')
			// const { productId, options } = req.body // Отримання id продукту
			// Перевірка чи існує продукт const
			// const product = await ProductsDBService.getById(productId)

			// if (!product) {
			// 	return res.status(404).json({ message: 'Product not found' }) // Відправка помилки, якщо продукт не знайдено
			// }

			// Оновлення корзини або додавання нового продукту
			// const cart = await CartDBService.addProduct({
			// 	userId,
			// 	productId,
			// 	options,
			// })

			res.status(200).json({ message: 'Product added successfully' })
			// res.status(200).json({ message: 'Product added successfully', cart })
		} catch (err) {
			next(err)
		}
	}
	static async updateProductAmount(req, res, next) {
		const userId = req.user.id // Отримання id користувача

		try {
			const { productId, amount } = req.body // Отримання id продукту та кількості з тіла запиту
			// Перевірка чи існує продукт const
			const product = await ProductsDBService.getById(productId)
			if (!product) {
				return res.status(404).json({ message: 'Product not found' }) // Відправка помилки, якщо продукт не знайдено
			}

			// Оновлення корзини або додавання нового продукту
			const cart = await CartDBService.updateProductAmount({
				userId,
				productId,
				amount,
			})

			res.status(200).json({ message: 'Product amount updated successfully', cart })
		} catch (err) {
			next(err)
		}
	}
	static async deleteProduct(req, res, next) {
		const userId = req.user.id
		try {
			const { id } = req.body
			const cart = await CartDBService.deleteProduct({ userId, productId: id })
			res.status(200).json({ message: 'Product deleted', cart })
		} catch (err) {
			next(err)
		}
	}
}

export default CartController
