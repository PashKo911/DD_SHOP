/**
 * Converts duration string to milliseconds.
 *
 * @param {string} durationStr - Duration value.
 * @returns {number}
 */

export function convertDuration(durationStr) {
	const timePattern = /^(\d+)([mhdwMy])$/
	const match = durationStr.match(timePattern)

	if (!match) {
		throw new Error('Invalid time format')
	}

	const value = parseInt(match[1], 10)
	const unit = match[2]

	switch (unit) {
		case 'm':
			return value * 60 * 1000
		case 'h':
			return value * 60 * 60 * 1000
		case 'd':
			return value * 24 * 60 * 60 * 1000
		case 'w':
			return value * 7 * 24 * 60 * 60 * 1000
		case 'M':
			return value * 30.44 * 24 * 60 * 60 * 1000
		case 'y':
			return value * 365.25 * 24 * 60 * 60 * 1000
		default:
			throw new Error('Invalid time unit')
	}
}
