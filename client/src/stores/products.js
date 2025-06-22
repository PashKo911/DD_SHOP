import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useGeneralStore } from './general'
import { useFilterStore } from './filter'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from './commonStore'

import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import applyColorFilterToProducts from '@/utils/productsHelpers/applyColorFilterToProducts'
import buildSuggestionGroups from '@/utils/productsHelpers/buildSuggestionGroups'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const filterStore = useFilterStore()
	const commonStore = useCommonStore()

	const { locale, t } = useI18n()
	//========================================================================================================================================================

	const { generalApiOperation, isLoading } = generalStore
	const { apiQueryParams, filter } = storeToRefs(filterStore)
	const { currentProductsPerPageByViewMode } = storeToRefs(commonStore)

	const products = ref([])
	const suggestions = ref([])
	const count = ref(null)
	//========================================================================================================================================================

	const productsValue = computed(() => {
		let productsCopy = [...products.value]

		if (productsCopy.length > currentProductsPerPageByViewMode.value) {
			productsCopy = productsCopy.slice(
				0,
				currentProductsPerPageByViewMode.value,
			)
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

		count.value = data.count
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
		count,
		isSuggestionsLoading,
		isProductsLoading,
	}
})
