import mongoose from 'mongoose'
const { Schema } = mongoose

const genderSchema = new Schema({
	label: {
		en: {
			type: String,
			enum: ['women', 'men'],
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
