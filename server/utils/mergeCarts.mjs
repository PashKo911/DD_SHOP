/**
 * Merge incoming cart items with stored cart items.
 * - Items are considered the same if product+variant+size match (stringified).
 * - Amounts coerced to numbers and summed.
 * - Returns array of plain objects (POJOs) safe to assign to a Mongoose document.
 *
 * @param {Array<Object>} incomingItems - items from frontend (e.g. req.body.productsList)
 * @param {Array<Object>} storedItems - items from DB (may be POJOs or Mongoose docs)
 * @returns {Array<Object>} mergedItems - array of plain objects with normalized `amount` (Number)
 */
function mergeCartItems(incomingItems = [], storedItems = []) {
	const makeKey = ({ product, variant, size }) => `${product ?? ''}:${variant ?? ''}:${size ?? ''}`

	const map = new Map()
	for (const p of storedItems) {
		const obj = p && typeof p.toObject === 'function' ? p.toObject() : { ...p }
		obj.amount = Number(obj.amount) || 0
		const key = makeKey(obj)
		map.set(key, { ...obj })
	}

	for (const raw of incomingItems) {
		if (!raw) continue

		const item = { ...raw }
		const amount = Number(item.amount)

		if (!Number.isFinite(amount) || amount <= 0) continue

		item.amount = amount
		const key = makeKey(item)

		if (map.has(key)) {
			const matchedProduct = map.get(key)

			if (matchedProduct.amount !== item.amount) {
				matchedProduct.amount = item.amount
				map.set(key, matchedProduct)
			}
		} else {
			map.set(key, { ...item })
		}
	}

	return Array.from(map.values())
}

export default mergeCartItems
