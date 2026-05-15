import mongoose from 'mongoose'
const { Schema } = mongoose

const categorySchema = new Schema({
	key: {
		type: String,
		enum: ['men', 'women'],
		required: true,
		lowercase: true,
		trim: true,
	},
	label: {
		en: {
			type: String,
			required: [true, 'English category label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
		uk: {
			type: String,
			required: [true, 'Ukrainian category label is required'],
			trim: true,
		},
	},
})

const Category = mongoose.model('Category', categorySchema)
export default Category
