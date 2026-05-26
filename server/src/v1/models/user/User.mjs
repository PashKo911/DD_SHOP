import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { appConstants } from '../../../../constants/app.mjs'

const { Schema } = mongoose

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			minlength: [3, 'Email must be at least 3 characters long'],
		},

		password: {
			type: String,
			select: false,
			required: function () {
				return !this.googleId
			},
			minlength: [8, 'Password must be at least 8 characters long'],
		},

		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},

		avatar: String,

		type: {
			type: Schema.Types.ObjectId,
			ref: 'Type',
			default: new mongoose.Types.ObjectId('67434ecae0c00366f89f7189'),
		},

		name: {
			type: String,
			default: appConstants.defaultUserName,
		},
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next()
	}
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
	const update = this.getUpdate()
	if (update.password) {
		const salt = await bcrypt.genSalt(10)
		update.password = await bcrypt.hash(update.password, salt)
		this.setUpdate(update)
	}
	next()
})

userSchema.methods.validPassword = async function (password) {
	if (!this.password) return false

	const isMatch = await bcrypt.compare(password, this.password)

	return isMatch
}

const User = mongoose.model('User', userSchema)
export default User
