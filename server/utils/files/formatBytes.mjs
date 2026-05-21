/**
 * Converts bytes into a human-readable format.
 *
 * Supported units:
 * - B
 * - KB
 * - MB
 *
 * Returns "-" if the value is invalid or missing.
 *
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */

export default function formatBytes(bytes) {
	if (!bytes || isNaN(bytes)) return '-'

	const b = Number(bytes)

	if (b < 1024) return `${b}B`
	if (b < 1024 * 1024) return `${(b / 1024).toFixed(2)}KB`
	return `${(b / 1024 / 1024).toFixed(2)}MB`
}
