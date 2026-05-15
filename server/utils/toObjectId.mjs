import mongoose from 'mongoose'

/**
 * Convert string(s) to mongoose ObjectId.
 *
 * - Accepts single value or array.
 * - Returns ObjectId(s).
 * - Throws if input is invalid.
 *
 * @param {string|string[]|mongoose.Types.ObjectId|mongoose.Types.ObjectId[]} input
 * @returns {mongoose.Types.ObjectId|mongoose.Types.ObjectId[]}
 */
export function toObjectId(input) {
	const { ObjectId } = mongoose.Types

	const convert = (val) => {
		if (val instanceof ObjectId) return val
		if (typeof val === 'string' && ObjectId.isValid(val)) return new ObjectId(val)
		throw new Error(`Invalid ObjectId: ${val}`)
	}

	return Array.isArray(input) ? input.map(convert) : convert(input)
}
