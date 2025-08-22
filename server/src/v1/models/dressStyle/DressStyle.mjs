import mongoose from 'mongoose'
const { Schema } = mongoose

const styleSchema = new Schema({
	label: {
		en: {
			type: String,
			required: [true, 'English dress style label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
		uk: {
			type: String,
			required: [true, 'Ukrainian dress style label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
	},
	imgSrc: {
		type: String,
		trim: true,
	},
})

const DressStyle = mongoose.model('Style', styleSchema)
export default DressStyle
