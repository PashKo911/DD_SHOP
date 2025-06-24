import mongoose from 'mongoose'
const { Schema } = mongoose

const sizeSchema = new Schema({
	label: {
		type: String,
		required: [true, 'Size value is required'],
		trim: true,
		set: (v) => v.toLowerCase(),
	},
	value: {
		type: String,
		required: [true, 'Value is required'],
		unique: true,
		trim: true,
		set: (v) => v.toLowerCase(),
	},
})

const Size = mongoose.model('Size', sizeSchema)
export default Size
