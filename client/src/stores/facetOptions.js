import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useGeneralStore } from './general'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'

export const useFacetOptionsStore = defineStore('facetOptions', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore

	const availableStyles = ref([])
	const availableColors = ref([])
	const availableSizes = ref([])
	const priceRange = ref([])

	const allOptions = ref()

	const getOptions = async () => {
		allOptions.value = await generalApiOperation({
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.products.getOptions())
				return response.data
			},
		})
	}

	return {
		availableStyles,
		availableColors,
		availableSizes,
		allOptions,
		priceRange,
		getOptions,
	}
})
