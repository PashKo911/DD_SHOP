import CartDBService from '../models/cart/CartDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'

class CartController {
	static async getCartDetails(req, res) {
		try {
			const userId = req.user.id // Отримання id користувача

			const cartDetails = await CartDBService.getCartDetails(userId)
			res.status(200).json(
				cartDetails
				// user: req.user,
			)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Error fetching products' })
		}
	}
	static async addProduct(req, res) {
		const userId = req.user.id // Отримання id користувача

		try {
			const { productId, options } = req.body // Отримання id продукту
			// Перевірка чи існує продукт const
			const product = await ProductsDBService.getById(productId)

			if (!product) {
				return res.status(404).json({ message: 'Product not found' }) // Відправка помилки, якщо продукт не знайдено
			}

			// Оновлення корзини або додавання нового продукту
			const cart = await CartDBService.addProduct({
				userId,
				productId,
				options,
			})

			res.status(200).json({ message: 'Product added successfully', cart })
		} catch (err) {
			console.error(err)
			res.status(500).json({ errors: [{ msg: err.message }] })
		}
	}
	static async updateProductAmount(req, res) {
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
			res.status(500).json({ errors: [{ msg: err.message }] })
		}
	}
	static async deleteProduct(req, res) {
		const userId = req.user.id
		try {
			const { id } = req.body
			const cart = await CartDBService.deleteProduct({ userId, productId: id })
			res.status(200).json({ message: 'Product deleted', cart })
		} catch (error) {
			res.status(500).json({ error: 'Error deleting product' })
		}
	}
}

export default CartController
