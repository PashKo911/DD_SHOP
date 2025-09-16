import mongoose from 'mongoose'

const { Schema } = mongoose

const subscriberSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		minLength: [3, 'Min 3 characters long'],
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Subscriber = mongoose.model('Subscriber', subscriberSchema)

export default Subscriber
