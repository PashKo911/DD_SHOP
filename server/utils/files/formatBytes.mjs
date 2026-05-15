/**
 * Перетворює кількість байтів у зручний для читання формат.
 *
 * Підтримуються одиниці:
 * - B
 * - KB
 * - MB
 *
 * Якщо значення некоректне або відсутнє — повертає "-".
 *
 * @param {number} bytes - Кількість байтів
 * @returns {string} Відформатований рядок
 */

export default function formatBytes(bytes) {
	if (!bytes || isNaN(bytes)) return '-'

	const b = Number(bytes)

	if (b < 1024) return `${b}B`
	if (b < 1024 * 1024) return `${(b / 1024).toFixed(2)}KB`
	return `${(b / 1024 / 1024).toFixed(2)}MB`
}
