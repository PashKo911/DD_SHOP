import mongoose from 'mongoose'
import { appConfig } from '../../../../config/appConfig.mjs'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const userSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		minlength: [3, 'Email must be at least 3 characters long'],
		trim: true,
	},
	password: {
		type: String,
		required: function () {
			return !this.googleId
		},
		minlength: [6, 'Password must be at least 6 characters long'],
		// validate: {
		//   validator: function (v) {
		//     return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
		//       v
		//     )
		//   },
		//   message: (props) =>
		//     'Password must contain at least one letter, one number, and one special character',
		// },
	},
	googleId: {
		type: String,
		unique: true,
		sparse: true,
	},
	avatar: {
		type: String,
	},
	type: {
		type: Schema.Types.ObjectId,
		ref: 'Type',
		default: new mongoose.Types.ObjectId('677c1233e3da04adc6ade35e'),
	},
	name: {
		type: String,
		default: appConfig.defaultUserName,
	},
})

// Хешування паролю перед збереженням
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next()
	}
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// Хешування паролю перед оновленням
userSchema.pre('findOneAndUpdate', async function (next) {
	const update = this.getUpdate() //отримуємо об"єкт оновлення
	if (update.password) {
		const salt = await bcrypt.genSalt(10)
		update.password = await bcrypt.hash(update.password, salt)
		this.setUpdate(update)
	}
	next()
})

//---------------- Функція для перевірки правильності пароля ------------
userSchema.methods.validPassword = async function (password) {
	if (!this.password) return false

	const isMatch = await bcrypt.compare(password, this.password)

	return isMatch
}

const User = mongoose.model('User', userSchema)
export default User
