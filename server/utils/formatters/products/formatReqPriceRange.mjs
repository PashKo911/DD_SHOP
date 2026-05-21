import { HttpError } from '../../../errors/HttpError.mjs'

/**
 * Converts `req.price` range to base currency using rate.
 *
 * @param {Object} req - Request-like object.
 * @param {number} rate - Exchange rate.
 * @returns {Object} Updated req object.
 */

function formatReqPriceRange(req, rate) {
	if (!req.price) return req
	if (!Array.isArray(req.price) || req.price.length !== 2) return req

	const minPrice = Number(req.price[0])
	const maxPrice = Number(req.price[1])

	if (!isFinite(minPrice) || !isFinite(maxPrice)) {
		throw new HttpError(400, 'Invalid price range')
	}
	req.price = [Math.floor(minPrice / rate), Math.ceil(maxPrice / rate)]
	return req
}
export default formatReqPriceRange
