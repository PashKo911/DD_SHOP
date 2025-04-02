import mongoose from 'mongoose'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import Cart from './Cart.mjs'
import ProductsDBService from '../product/ProductsDBService.mjs'
import UsersDBService from '../user/UsersDBService.mjs'

class CartDBService extends MongooseCRUDManager {
	/**
	 * Отримує інформацію про козину покупця:
	 * Отримання інформації про покупця.
	 * Отримання списку товарів з деталями про кожен товар і його продавця.
	 * Обчислення загальної вартості покупки.
	 *
	 * @param {ObjectId} userId - id покупця.
	 * @returns {PromiseCart>} - Promise, який вирішується об"єктом з відповідними властивостями.
	 */

	//============== версія з populate ==========
	async getCartDetails(userId) {
		try {
			// Знаходимо корзину за userId та заповнюємо зв'язані поля
			const cartDetails = await Cart.findOne({
				customer: userId,
			})
				.populate({
					path: 'productsList.product',
					select: 'count paths price title',
				})
				.populate({
					path: 'productsList.color',
					select: 'label value',
				})
				.populate({
					path: 'productsList.size',
					select: 'label',
				})

			if (!cartDetails) {
				throw new Error('Cart not found') // Викидання помилки, якщо корзину не знайдено
			}

			// Обчислення потрібних полів
			const customer = cartDetails.customer
			let products = cartDetails.productsList
			let total = 0

			if (products.length) {
				products = cartDetails.productsList.map((item) => ({
					details: item.product,

					totalProductsPrice: item.product.price * item.amount,
					amount: item.amount,
					color: item.color,
					size: item.size,
				}))

				total = products.reduce((total, item) => total + item.totalProductsPrice, 0)
			}

			return {
				customer,
				products,
				total,
			}
		} catch (error) {
			console.error(error) // Виведення помилки в консоль
			throw error // Викидання помилки для обробки поза функцією
		}
	}

	//--- оновлення кількості проудкту в корзині
	async updateProductAmount({ userId, productId, amount }) {
		try {
			// Оновлення корзини або додавання нового продукту
			const cart = await Cart.findOneAndUpdate(
				{
					// Знаходження корзини та продукту у ній
					customer: userId, // Умова пошуку кошика користувача за userId
					'productsList.product': productId, //Умова пошуку товару у масиві за productId
				},
				{
					// Оновлення кількості існуючого продукту
					$set: { 'productsList.$.amount': amount }, //Символ $ є оператором, який вказує на відповідний
					//елемент у масиві, що відповідає умові запиту.
				},
				{ new: true }
			)
			return cart
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	//--- додавння  проудкту в корзину
	async addProduct({ userId, productId, options }) {
		try {
			let cart = await Cart.findOne({ customer: userId })
			if (cart) {
				// Якщо корзина існує, перевіряємо, чи продукт вже є у корзині
				const productIndex = cart.productsList.findIndex((item) => item.product.toString() === productId)

				if (productIndex > -1) {
					// Якщо продукт існує, збільшуємо його кількість
					cart.productsList[productIndex].amount += 1
				} else {
					// Якщо продукт не існує, додаємо його з кількістю 1
					cart.productsList.push({ product: productId, amount: 1, ...options })
				}
				cart = await cart.save() // Збереження змін у корзині
			} else {
				// Оновлення корзини або додавання нового продукту
				cart = await Cart.create({
					customer: userId,
					productsList: [{ product: productId, amount: 1, ...options }],
				})
			}
			return cart
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	//--- видаленя проудкту з корзини
	async deleteProduct({ userId, productId }) {
		try {
			// Оновлення корзини або додавання нового продукту
			const cart = await Cart.findOneAndUpdate(
				{ customer: userId }, // Знаходження корзини за userId
				{
					// Видалення продукту з масиву productsList
					$pull: { productsList: { product: productId } }, //$pull в MongoDB використовується
					// для видалення елементів з масиву, які відповідають певній умові
				},
				{
					new: true, // Повернення оновленого документу
				}
			)
			return cart
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async transferGuestCartToUser(guestId, userId) {
		try {
			// Отримати корзину гостя
			const guestCart = await super.findOne({ customer: guestId })

			if (!guestCart) {
				// Якщо корзина гостя відсутня, нічого не робимо
				const userCart = await super.findOne({ customer: userId })
				return userCart || null
			}

			// Отримати корзину користувача
			let userCart = await super.findOne({ customer: userId })

			if (!userCart) {
				// Якщо у користувача немає корзини, просто прив'язуємо корзину гостя до нього
				guestCart.customer = userId
				await guestCart.save()

				// Видаляємо гостя з колекції
				await UsersDBService.deleteById(guestId)

				return guestCart
			}

			// Об'єднати продукти з обох корзин
			const productMap = new Map()

			// Додаємо продукти з корзини користувача
			userCart.productsList.forEach(({ product, amount, color, size }) => {
				productMap.set(product.toString(), { amount, color, size })
			})

			// Додаємо продукти з корзини гостя
			guestCart.productsList.forEach(({ product, amount, color, size }) => {
				if (productMap.has(product.toString())) {
					// Якщо продукт вже є, оновлюємо кількість
					const existingProduct = productMap.get(product.toString())
					productMap.set(product.toString(), {
						amount: existingProduct.amount + amount,
						color: existingProduct.color, // Колір залишаємо старий
						size: existingProduct.size, // Розмір залишаємо старий
					})
				} else {
					// Якщо продукту немає, додаємо новий запис
					productMap.set(product.toString(), { amount, color, size })
				}
			})

			// Оновлюємо корзину користувача
			userCart.productsList = Array.from(productMap.entries()).map(([product, { amount, color, size }]) => ({
				product: new mongoose.Types.ObjectId(product),
				amount,
				color,
				size,
			}))

			await userCart.save()

			// Видаляємо корзину гостя
			await super.deleteById(guestCart._id)

			// Видаляємо гостя з колекції
			await UsersDBService.deleteById(guestId)

			return userCart
		} catch (error) {
			console.error('Error transferring guest cart:', error)
			throw error
		}
	}
}

export default new CartDBService(Cart)
