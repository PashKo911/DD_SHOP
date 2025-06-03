import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { useGeneralStore } from './general'
import { useI18n } from 'vue-i18n'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'

export const useFacetOptionsStore = defineStore('facetOptions', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore
	const { locale, numberFormats } = useI18n()

	const facetOptions = reactive({
		genders: [],
		styles: [],
		colors: [],
		sizes: [],
		price: [],
	})

	const availableStyles = ref()

	const availableStylesValue = computed(() => {
		return availableStyles.value
	})

	const currency = computed(() => {
		return numberFormats.value[locale.value].currency
	})

	const facetOptionsValue = computed(() => {
		return {
			...facetOptions,
			price: [
				Math.round(facetOptions.price[0]),
				Math.round(facetOptions.price[1]),
			],
		}
	})

	const getFacetOptions = async () => {
		const data = await generalApiOperation({
			operationName: 'getFacetOptions',
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.products.getOptions)
				return response.data
			},
		})
		Object.assign(facetOptions, data)
	}

	const getAvailableStyles = async () => {
		availableStyles.value = await generalApiOperation({
			operationName: 'getAvailableStyles',
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
		currency,
		availableStyles,
		availableStylesValue,
		getAvailableStyles,
	}
})
