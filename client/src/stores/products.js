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

	const { locale } = useI18n()
	//========================================================================================================================================================

	const { generalApiOperation, isLoading } = generalStore
	const { apiQueryParams, filter, perPage } = storeToRefs(filterStore)

	const defaultProducts = ref([])
	const topSalesProducts = ref([])
	const newestProducts = ref([])
	const suggestions = ref([])

	//========================================================================================================================================================

	const defaultProductsValue = computed(() => {
		const products = defaultProducts.value.documents

		if (!Array.isArray(products)) {
			return []
		}
		let productsCopy = [...products]

		if (productsCopy.length > perPage.value) {
			productsCopy = productsCopy.slice(0, perPage.value)
		}
		return applyColorFilterToProducts(productsCopy, filter.value.colors)
	})

	const totalDefaultProductsCount = computed(() => {
		return defaultProducts.value.count
	})
	const topSalesProductsValue = computed(() => {
		const data = topSalesProducts.value
		return Array.isArray(data.documents) ? data.documents : []
	})

	const newestProductsValue = computed(() => {
		const data = newestProducts.value
		return Array.isArray(data.documents) ? data.documents : []
	})

	const suggestionsValue = computed(() => {
		return buildSuggestionGroups(suggestions.value, locale.value)
	})
	const isSuggestionsLoading = computed(() => {
		return isLoading('getSuggestions')
	})
	const isProductsLoading = computed(() => {
		return isLoading(queryPresets.value.default.name)
	})
	//========================================================================================================================================================
	const queryPresets = computed(() => ({
		default: {
			name: 'defaultProducts',
			queryParams: apiQueryParams.value,
		},
		topSales: {
			name: 'topSalesProducts',
			queryParams: { sort: 'maxRating:desc,', page: 0, perPage: 15 },
		},
		newest: {
			name: 'newestProducts',
			queryParams: { sort: 'createdAt:desc', page: 0, perPage: 15 },
		},
	}))

	const getProducts = async (queryParams = {}, targetRef, operationName) => {
		const { data } = await generalApiOperation({
			operationName: operationName,
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getProducts, {
					params: queryParams,
				})
				return response.data
			},
		})

		targetRef.value = data
	}

	const getDefaultProducts = async () =>
		getProducts(
			queryPresets.value.default.queryParams,
			defaultProducts,
			queryPresets.value.default.name,
		)

	const getTopSalesProducts = async () =>
		getProducts(
			queryPresets.value.topSales.queryParams,
			topSalesProducts,
			queryPresets.value.topSales.name,
		)
	const getNewestProducts = async () =>
		getProducts(
			queryPresets.value.newest.queryParams,
			newestProducts,
			queryPresets.value.newest.name,
		)

	const getSuggestions = async (querySearch) => {
		const queryParams = {
			gender: filter.value.gender,
			perPage: 5,
			page: 0,
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
		// refs
		defaultProducts,
		topSalesProducts,
		newestProducts,
		suggestions,
		totalDefaultProductsCount,

		// computed
		defaultProductsValue,
		suggestionsValue,
		topSalesProductsValue,
		newestProductsValue,

		// status
		isProductsLoading,
		isSuggestionsLoading,

		// actions
		getProducts,
		getDefaultProducts,
		getTopSalesProducts,
		getNewestProducts,
		getSuggestions,
	}
})
