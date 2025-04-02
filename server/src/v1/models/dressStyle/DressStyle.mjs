import mongoose from 'mongoose'
const { Schema } = mongoose

const dressStyleSchema = new Schema({
	label: {
		type: String,
		enum: ['classic', 'casual', 'business'],
		required: [true, 'Dress style is required'],
		trim: true,
		set: (v) => v.toLowerCase(),
	},
})

const DressStyle = mongoose.model('Style', dressStyleSchema)
export default DressStyle
