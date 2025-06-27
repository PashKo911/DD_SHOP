import mongoose from 'mongoose'
const { Schema } = mongoose

const localizedString = (field, min, max) => ({
	en: {
		type: String,
		required: [true, `${field} (en) is required`],
		minlength: [min, `${field} (en) must be at least ${min} characters long`],
		maxlength: max ? [max, `${field} (en) must be at most ${max} characters long`] : undefined,
		trim: true,
	},
	uk: {
		type: String,
		required: [true, `${field} (uk) is required`],
		minlength: [min, `${field} (uk) must be at least ${min} characters long`],
		maxlength: max ? [max, `${field} (uk) must be at most ${max} characters long`] : undefined,
		trim: true,
	},
})

const variantSchema = new Schema(
	{
		color: { type: Schema.Types.ObjectId, ref: 'Color', required: true },
		price: { type: Number, required: true, min: 0 },
		oldPrice: { type: Number, min: 0 },
		count: { type: Number, required: true, min: 0 },
		rating: { type: Number, min: 0, max: 5 },
		images: { type: [String], required: true },
		sizes: {
			type: [{ type: Schema.Types.ObjectId, ref: 'Size' }],
			required: true,
		},
	},
	{ _id: true }
)

const productSchema = new Schema(
	{
		slug: {
			type: String,
			required: [true, 'Slug is required'],
			unique: true,
			trim: true,
			lowercase: true,
		},
		title: localizedString('Title', 3, 50),
		description: localizedString('Description', 10, 1000),
		style: {
			type: Schema.Types.ObjectId,
			ref: 'Style',
			required: [true, 'Style is required'],
		},
		gender: {
			type: Schema.Types.ObjectId,
			ref: 'Gender',
			required: [true, 'Gender is required'],
		},

		minPrice: {
			type: Number,
			required: true,
			min: [0, 'minPrice must be at least 0'],
		},
		maxPrice: {
			type: Number,
			required: true,
			min: [0, 'maxPrice must be at least 0'],
		},
		maxRating: {
			type: Number,
			required: true,
			min: [0, 'maxRating must be at least 0'],
			max: [5, 'maxRating cannot exceed 5'],
		},
		defaultVariant: {
			type: Schema.Types.ObjectId,
			ref: 'Variant',
			required: true,
		},

		variants: {
			type: [variantSchema],
			required: [true, 'Variants are required'],
			validate: {
				validator: (v) => Array.isArray(v) && v.length > 0,
				message: 'At least one variant is required',
			},
		},
	},
	{
		timestamps: true,
	}
)

productSchema.pre('save', function (next) {
	if (!this.variants || this.variants.length === 0) return next()

	const prices = this.variants.map((v) => v.price)
	const ratings = this.variants.map((v) => v.rating || 0)

	this.minPrice = Math.min(...prices)
	this.maxPrice = Math.max(...prices)
	this.maxRating = Math.max(...ratings)

	if (!this.defaultVariant) {
		const cheapest = this.variants.reduce((a, b) => (a.price < b.price ? a : b))
		this.defaultVariant = cheapest.variantId
	}

	next()
})

const Product = mongoose.model('Product', productSchema)
export default Product
