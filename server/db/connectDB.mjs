import config from '../config/default.mjs'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
export default async function () {
	try {
		await mongoose.connect(config.mongoURI, {})
		console.log('Successfully connected to MongoDB')
	} catch (err) {
		console.error('Error connecting to MongoDB:', err)
	}
}
