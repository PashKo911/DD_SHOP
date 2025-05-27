import mongoose from 'mongoose'
const { Schema } = mongoose

const styleSchema = new Schema({
	label: {
		type: String,
		enum: ['classic', 'casual', 'business', 'party'],
		required: [true, 'Dress style is required'],
		trim: true,
		unique: true,
		set: (v) => v.toLowerCase(),
	},
	imgSrc: {
		type: String,
		trim: true,
	},
	labelUk: {
		type: String,
		required: [true, 'Ukrainian label is required'],
		trim: true,
		unique: true,
	},
})

const DressStyle = mongoose.model('Style', styleSchema)
export default DressStyle
