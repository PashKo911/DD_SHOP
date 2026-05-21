import mongoose from 'mongoose'
import { userTypes } from '../../../../constants/userTypes.mjs'

const { Schema } = mongoose

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		minlength: [3, 'Name must be at least 3 characters long'],
		maxlength: [50, 'Name must be at most 50 characters long'],
		enum: [userTypes.ADMIN, userTypes.MANAGER, userTypes.USER],
		trim: true,
	},
})

const Type = mongoose.model('Type', userSchema)
export default Type
