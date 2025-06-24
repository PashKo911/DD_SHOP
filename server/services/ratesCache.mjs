import { fetchRates } from './exchangeRateService.mjs'
import Rate from '../src/v1/models/rate/Rate.mjs'

let ratesCache = {}
let initialized = false

async function loadFromDb() {
	const docs = await Rate.find({}, { currency: 1, rate: 1, _id: 0 })

	ratesCache = docs.reduce((acc, { currency, rate }) => {
		acc[currency] = rate
		return acc
	}, {})

	initialized = true
}

export async function refreshRates() {
	try {
		const apiRates = await fetchRates()
		ratesCache = { ...apiRates }
		for (const [currency, rate] of Object.entries(apiRates)) {
			await Rate.findOneAndUpdate({ currency }, { rate }, { upsert: true, new: true, runValidators: true })
		}
	} catch (error) {
		console.error('Failed to update rates:', e)
	}
}

/**
 * Returns the exchange rate, guaranteeing the download of cash
 * @param {string} currency
 * @returns {Promise<number>}
 */
export async function getRate(currency) {
	if (!initialized) {
		await loadFromDb()
	}
	return ratesCache[currency]
}
