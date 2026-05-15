import mongoose from 'mongoose'

const { Schema } = mongoose

const OrderSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},

		courseId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},

		courseTitle: {
			type: String,
			required: true,
		},

		amount: {
			type: Number, // в копійках
			required: true,
		},

		currency: {
			type: String,
			default: 'UAH',
		},

		status: {
			type: String,
			enum: ['pending', 'paid', 'failed', 'expired'],
			default: 'pending',
			index: true,
		},
		accessGrantedAt: {
			type: Date,
		},
		mono: {
			invoiceId: {
				type: String,
				index: true,
			},

			status: {
				type: String,
				enum: ['created', 'processing', 'hold', 'success', 'failure', 'reversed', 'expired'],
			},

			failureReason: {
				type: String,
			},

			errCode: {
				type: String,
			},

			pageUrl: {
				type: String,
			},

			modifiedDate: {
				type: Date,
			},
			modifiedDateDB: {
				type: Date,
			},
		},
	},
	{
		timestamps: true,
	}
)

OrderSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export default mongoose.model('Order', OrderSchema)
