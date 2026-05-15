/**
 * Merge incoming cart items with stored cart items.
 * - Items are considered the same if product+variant+size match (stringified).
 * - Quantities coerced to numbers and summed.
 * - Returns array of plain objects (POJOs) safe to assign to a Mongoose document.
 *
 * @param {Array<Object>} incomingItems - items from frontend (e.g. req.body.productsList)
 * @param {Array<Object>} storedItems - items from DB (may be POJOs or Mongoose docs)
 * @returns {Array<Object>} mergedItems - array of plain objects with normalized `quantity` (Number)
 */
function mergeCartItems(incomingItems = [], storedItems = []) {
	const makeKey = ({ product, variant, size }) => `${product ?? ''}:${variant ?? ''}:${size ?? ''}`

	const map = new Map()
	for (const p of storedItems) {
		const obj = p && typeof p.toObject === 'function' ? p.toObject() : { ...p }
		obj.quantity = Number(obj.quantity) || 0
		const key = makeKey(obj)
		map.set(key, { ...obj })
	}

	for (const raw of incomingItems) {
		if (!raw) continue

		const item = { ...raw }
		const quantity = Number(item.quantity)

		if (!Number.isFinite(quantity) || quantity <= 0) continue

		item.quantity = quantity
		const key = makeKey(item)

		if (map.has(key)) {
			const matchedProduct = map.get(key)

			if (matchedProduct.quantity !== item.quantity) {
				matchedProduct.quantity = item.quantity
				map.set(key, matchedProduct)
			}
		} else {
			map.set(key, { ...item })
		}
	}

	return Array.from(map.values())
}

export default mergeCartItems
