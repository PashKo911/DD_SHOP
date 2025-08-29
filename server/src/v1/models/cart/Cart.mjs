import mongoose from 'mongoose'
const { Schema } = mongoose

const cartProductSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	variant: {
		type: Schema.Types.ObjectId,
		ref: 'Types',
		required: true,
	},
	size: {
		type: Schema.Types.ObjectId,
		ref: 'Size',
		required: [true, 'Size is required'],
	},
	amount: {
		type: Number,
		required: true,
		min: 1,
	},
})

const cartSchema = new Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	productsList: [cartProductSchema],
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
