import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			minlength: [3, 'Title must be at least 3 characters long'],
			maxlength: [50, 'Title must be at most 50 characters long'],
			trim: true,
		},
		price: {
			type: Number,
			required: [true, 'Price is required'],
			min: [0, 'Price must be a positive number'],
		},
		count: {
			type: Number,
			required: [true, 'Count is required'],
			min: [1, 'Count must be at least 1'],
		},
		rating: {
			type: Number,
			required: [true, 'Rating is required'],
			min: [2, 'Rating must be at least 2'],
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			minlength: [10, 'Description must be at least 3 characters long'],
		},
		paths: {
			type: [String],
			required: [true, 'Images are required'],
			validate: {
				validator: function (v) {
					return v && v.length === 4
				},
				message: 'Exactly 4 images are required',
			},
		},
		colors: {
			type: [{ type: Schema.Types.ObjectId, ref: 'Color' }],
			required: [true, 'Colors are required'],
			validate: {
				validator: function (v) {
					return v && v.length > 0
				},
				message: 'At least one color is required',
			},
		},
		sizes: {
			type: [{ type: Schema.Types.ObjectId, ref: 'Size' }],
			required: [true, 'Sizes are required'],
			validate: {
				validator: function (v) {
					return v && v.length > 0
				},
				message: 'At least one size is required',
			},
		},
		styles: {
			type: Schema.Types.ObjectId,
			ref: 'Style',
			required: [true, 'Dress style is required'],
		},
		gender: {
			type: Schema.Types.ObjectId,
			ref: 'Gender',
			required: [true, 'Gender is required'],
		},
	},
	{
		timestamps: true,
	}
)

const Product = mongoose.model('Product', productSchema)
export default Product
