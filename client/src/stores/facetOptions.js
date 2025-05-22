import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { useGeneralStore } from './general'
import { useI18n } from 'vue-i18n'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import exchangeRates from '@/locales/exchangeRates'

export const useFacetOptionsStore = defineStore('facetOptions', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore
	const { locale, numberFormats } = useI18n()

	const facetOptions = reactive({
		genders: [],
		styles: [],
		colors: [],
		sizes: [],
		priceRange: [],
	})

	const availableStyles = ref()

	const availableStylesValue = computed(() => {
		return availableStyles.value
	})

	const currency = computed(() => {
		return numberFormats.value[locale.value].currency
	})

	const exchangeRate = computed(() => {
		return exchangeRates[currency.value.currency]
	})

	const facetOptionsValue = computed(() => {
		return {
			...facetOptions,
			priceRange: [
				parseInt(facetOptions.priceRange[0] * exchangeRate.value),
				parseInt(facetOptions.priceRange[1] * exchangeRate.value),
			],
		}
	})

	const getFacetOptions = async () => {
		const data = await generalApiOperation({
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.products.getOptions)
				return response.data
			},
		})
		Object.assign(facetOptions, data)
	}

	const getAvailableStyles = async () => {
		availableStyles.value = await generalApiOperation({
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.products.getStyles)
				return response.data.styles
			},
		})
	}

	return {
		facetOptions,
		facetOptionsValue,
		getFacetOptions,
		exchangeRate,
		currency,
		availableStyles,
		availableStylesValue,
		getAvailableStyles,
	}
})
