import { HttpError } from '../../../../errors/HttpError.mjs'
import getDiscount from '../../../../utils/getDiscount.mjs'

/**
 * Formats and localizes a product document for client response.
 *
 * - Converts prices using the given exchange rate and currency formatter.
 * - Localizes text fields (title, description, labels) to the specified language.
 * - Computes and attaches discount information.
 *
 * @param {Object} product - The raw product document from the database.
 * @param {string} language - Target language code for localization.
 * @param {number} rate - Exchange rate to apply to numeric prices.
 * @param {Intl.NumberFormat} formatter - Formatter for displaying prices in the target currency.
 * @returns {Object} A transformed product object, ready for client consumption.
 */

function formatProductForResponse(product, language, rate, formatter) {
	const formattedVariants = product.variants.map((v) => {
		const exchangedPrice = Math.round(v.price * rate)
		const exchangedOldPrice = v.oldPrice ? Math.round(v.oldPrice * rate) : null
		const oldPrice = exchangedOldPrice ? formatter.format(exchangedOldPrice) : null

		return {
			...v,
			oldPrice,
			price: formatter.format(exchangedPrice),
			discount: getDiscount(v.oldPrice, v.price),
			color: { ...v.color, label: v.color.label[language] },
		}
	})

	return {
		...product,
		variants: formattedVariants,
		title: product.title[language],
		description: product.description[language],
		style: {
			...product.style,
			label: product.style.label[language],
		},
	}
}

/**
 * Normalize and convert a request's `price` range from client currency to base currency using the given rate.
 *
 * This function expects `req.price` to be an array of two items: [min, max].
 * It validates values, converts them to numbers, applies the exchange rate
 * (dividing client-side prices by `rate`) and replaces `req.price` with an
 * integer range suitable for querying the DB:
 *   - min -> Math.floor(min / rate)
 *   - max -> Math.ceil(max / rate)
 *
 * The function mutates the passed `req` object and returns it (same reference).
 *
 * @param {Object} req - The request-like object that may contain a `price` property.
 *                       Example: { price: ['100.00', '200.00'], other: '...' }
 * @param {number} rate - Exchange rate (client currency -> base currency). Must be a finite, non-zero number.
 * @returns {Object} The same `req` object with `req.price` normalized/converted if it was present and valid.
 *
 **/

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
export { formatProductForResponse, formatReqPriceRange }
