import mongoose from 'mongoose'
const { Schema } = mongoose

const colorSchema = new Schema({
	label: {
		en: {
			type: String,
			required: [true, 'English color label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
		uk: {
			type: String,
			required: [true, 'Ukrainian color label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
	},
	value: {
		type: String,
		required: [true, 'Color value is required'],
		unique: true,
		trim: true,
		validate: {
			validator: function (v) {
				return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(v)
			},
			message: (props) => `${props.value} is not a valid HEX color code!`,
		},
	},
	slug: {
		type: String,
		required: [true, 'Slug is required'],
		trim: true,
		lowercase: true,
	},
})

const Color = mongoose.model('Color', colorSchema)
export default Color
