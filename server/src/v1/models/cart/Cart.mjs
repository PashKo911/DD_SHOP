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
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
})

const cartSchema = new Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Customer Id is required'],
		unique: true,
	},
	productsList: [cartProductSchema],
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
