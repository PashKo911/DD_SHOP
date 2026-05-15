import mongoose from 'mongoose'
const { Schema } = mongoose

const sizeSchema = new Schema({
	label: {
		en: {
			type: String,
			required: [true, 'English size label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
		uk: {
			type: String,
			required: [true, 'Ukrainian size label is required'],
			trim: true,
			set: (v) => v.toLowerCase(),
		},
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
