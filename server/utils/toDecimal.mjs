import Decimal from 'decimal.js'

/**
 * Convert a value to Decimal or null.
 *
 * @param {any} value - Input value.
 * @returns {Decimal|null} Decimal instance or null.
 */

function toDecimal(value) {
	if (value === undefined || value === null) return null

	if (typeof value === 'object' && typeof value.toString === 'function') {
		return new Decimal(value.toString())
	}

	return new Decimal(String(value))
}

export default toDecimal
