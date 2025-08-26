import mongoose from 'mongoose'
const { Schema } = mongoose

const genderSchema = new Schema({
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
			required: [true, 'English gender label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
		uk: {
			type: String,
			required: [true, 'Ukrainian gender label is required'],
			trim: true,
		},
	},
})

const Gender = mongoose.model('Gender', genderSchema)
export default Gender
