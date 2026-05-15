import Decimal from 'decimal.js'
import { HttpError } from '../../errors/HttpError.mjs'
import getDiscountPercent from '../getDiscountPercent.mjs'
import toDecimal from '../toDecimal.mjs'

/**
 * Localize product and apply exchange rate.
 * @param {Object} product
 * @param {string} language
 * @param {number|Decimal|null} rate
 * @returns {Object} localized product
 */

function formatProductForResponse(product, language, rate) {
	const rateDec = toDecimal(rate)
	const variants = Array.isArray(product.variants) ? product.variants : []

	const formattedVariants = variants.map((v) => {
		const priceDec = toDecimal(v?.price)
		const oldPriceDec = toDecimal(v?.oldPrice)

		const exchangedDec =
			priceDec && rateDec ? priceDec.mul(rateDec).toDecimalPlaces(2, Decimal.ROUND_HALF_UP) : null
		const exchangedOldDec =
			oldPriceDec && rateDec ? oldPriceDec.mul(rateDec).toDecimalPlaces(2, Decimal.ROUND_HALF_UP) : null

		const price = exchangedDec ? exchangedDec.toNumber() : null
		const oldPrice = exchangedOldDec ? exchangedOldDec.toNumber() : null
		return {
			...v,
			oldPrice,
			price,
			discount: getDiscountPercent(oldPriceDec, priceDec),
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
export { formatProductForResponse, formatReqPriceRange }
