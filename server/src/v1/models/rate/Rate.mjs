import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const rateSchema = new Schema(
	{
		currency: String,
		rate: Number,
	},
	{
		timestamps: true,
	}
)

const Rate = mongoose.model('Rate', rateSchema)

export default Rate
