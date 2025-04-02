import mongoose from 'mongoose'
const { Schema } = mongoose

const colorSchema = new Schema({
	label: {
		type: String,
		required: [true, 'Color label is required'],
		unique: true,
		trim: true,
		set: (v) => v.toLowerCase(),
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
})

const Color = mongoose.model('Color', colorSchema)
export default Color
