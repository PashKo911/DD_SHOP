import axios from 'axios'
import { config } from '../config/default.mjs'

export async function fetchRates() {
	try {
		const response = await axios.get(config.exchangeRateApiUrl)
		const { USD, EUR, UAH } = response.data.rates
		return { USD, EUR, UAH }
	} catch (error) {
		throw new Error('Error fetching exchange rates')
	}
}
