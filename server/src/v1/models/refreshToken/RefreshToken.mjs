import mongoose from 'mongoose'

const { Schema } = mongoose

const refreshTokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		tokenHash: {
			type: String,
			required: true,
			unique: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			index: { expireAfterSeconds: 0 },
		},
		revokedAt: {
			type: Date,
			default: null,
		},
		userAgent: String,
		ip: String,
	},
	{ timestamps: true },
)

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

export default RefreshToken
