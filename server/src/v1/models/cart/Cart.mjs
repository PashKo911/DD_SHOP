import mongoose from 'mongoose' // Імпорт бібліотеки mongoose
const { Schema } = mongoose // Деструктуризація об'єкта Schema з mongoose

//------  Схема для товару в кошику ------
const cartProductSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId, // Поле для збереження посилання на товар
		ref: 'Product', // Вказує, що це посилання на модель 'Product'
		required: true, // Поле обов'язкове для заповнення
	},
	amount: {
		type: Number, // Поле для збереження кількості товару
		required: true, // Поле обов'язкове для заповнення
		min: 1, // Мінімальне значення - 1
	},
	size: {
		type: Schema.Types.ObjectId, // Ссилка на одиничний розмір
		ref: 'Size', // Вказує, що це посилання на модель 'Size'
		required: [true, 'Size is required'], // Поле обов'язкове для заповнення
	},
	color: {
		type: Schema.Types.ObjectId, // Ссилка на одиничний колір
		ref: 'Color', // Вказує, що це посилання на модель 'Color'
		required: [true, 'Color is required'], // Поле обов'язкове для заповнення
	},
})

//========  Схема для кошика  ========
const cartSchema = new Schema({
	customer: {
		type: Schema.Types.ObjectId, // Поле для збереження посилання на користувача
		ref: 'User', // Вказує, що це посилання на модель 'User'
		required: true, // Поле обов'язкове для заповнення
	},
	productsList: [cartProductSchema], // Масив товарів у кошику
})

// Створення моделі 'Cart' на основі схеми 'cartSchema'
const Cart = mongoose.model('Cart', cartSchema)
export default Cart // Експорт моделі 'Cart' для використання в інших файлах
