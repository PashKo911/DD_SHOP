import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useGeneralStore } from './general'
import { useFilterStore } from './filter'
import { useI18n } from 'vue-i18n'

import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import applyColorFilterToProducts from '@/utils/productsHelpers/applyColorFilterToProducts'
import buildSuggestionGroups from '@/utils/productsHelpers/buildSuggestionGroups'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const filterStore = useFilterStore()

	const { locale, t } = useI18n()
	//========================================================================================================================================================

	const { generalApiOperation, isLoading } = generalStore
	const { apiQueryParams, filter, perPage } = storeToRefs(filterStore)

	const products = ref([])
	const suggestions = ref([])
	const totalCount = ref(null)
	//========================================================================================================================================================

	const productsValue = computed(() => {
		let productsCopy = [...products.value]

		if (productsCopy.length > perPage.value) {
			productsCopy = productsCopy.slice(0, perPage.value)
		}
		return applyColorFilterToProducts(productsCopy, filter.value.colors)
	})

	const suggestionsValue = computed(() => {
		return buildSuggestionGroups(suggestions.value, locale.value)
	})
	const isSuggestionsLoading = computed(() => {
		return isLoading('getSuggestions')
	})
	const isProductsLoading = computed(() => {
		return isLoading('getProducts')
	})
	//========================================================================================================================================================

	const getProducts = async () => {
		const { data } = await generalApiOperation({
			operationName: 'getProducts',
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getProducts, {
					params: apiQueryParams.value,
				})
				return response.data
			},
		})

		totalCount.value = data.count
		products.value = data.documents
	}
	const getSuggestions = async (querySearch) => {
		const queryParams = {
			...apiQueryParams.value,
			perPage: 5,
			title: querySearch,
		}
		const { data } = await generalApiOperation({
			operationName: 'getSuggestions',
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getSuggestions, {
					params: queryParams,
				})
				return response.data
			},
		})
		suggestions.value = data
	}

	return {
		products,
		productsValue,
		getProducts,
		suggestions,
		suggestionsValue,
		getSuggestions,
		totalCount,
		isSuggestionsLoading,
		isProductsLoading,
	}
})
