import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useGeneralStore } from './general'
import { useFilterStore } from './filter'
import { useI18n } from 'vue-i18n'

import apiClient from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'
import applyColorFilterToProducts from '@/utils/productsHelpers/applyColorFilterToProducts'
import routeNames from '@/router/routeNames'
import shopConstants from '@/constants/shop'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const filterStore = useFilterStore()

	const { locale } = useI18n()
	//========================================================================================================================================================

	const { generalApiOperation, isLoading, hasError } = generalStore
	const { apiQueryParams, filter, perPage } = storeToRefs(filterStore)

	const defaultProducts = ref([])
	const topSalesProducts = ref([])
	const newestProducts = ref([])
	const sameProducts = ref([])
	const suggestions = ref([])
	const productDetails = ref({})

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
		same: {
			name: 'sameProducts',
			queryParams: { sort: 'maxRating:desc,', page: 0, perPage: 15 },
		},
		suggestions: {
			name: 'suggestions',
			queryParams: {
				limit: shopConstants.suggestionCountLimit,
			},
		},
		productDetail: {
			name: routeNames.PRODUCT_DETAIL,
		},
	}))

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

	const sameProductsValue = computed(() => {
		const data = sameProducts.value
		return Array.isArray(data.documents) ? data.documents : []
	})

	const suggestionsValue = computed(() => {
		return suggestions.value
	})

	const productDetailsValue = computed(() => {
		return productDetails.value
	})
	//========================================================================================================================================================

	const isSuggestionsLoading = computed(() => {
		return isLoading(queryPresets.value.suggestions.name)
	})

	const isProductsLoading = computed(() => {
		return isLoading(queryPresets.value.default.name)
	})

	const isNewestProductsLoading = computed(() => {
		return isLoading(queryPresets.value.newest.name)
	})

	const hasNewestProductsError = computed(() => {
		return Boolean(hasError(queryPresets.value.newest.name))
	})

	const isTopSalesProductsLoading = computed(() => {
		return isLoading(queryPresets.value.topSales.name)
	})
	const hasTopSalesProductsError = computed(() => {
		return Boolean(hasError(queryPresets.value.topSales.name))
	})

	const isSameProductsLoading = computed(() => {
		return isLoading(queryPresets.value.same.name)
	})

	const hasSameProductsError = computed(() => {
		return Boolean(hasError(queryPresets.value.same.name))
	})

	const isProductDetailsLoading = computed(() => {
		return isLoading(queryPresets.value.productDetail.name)
	})

	const isProductDetailsLoaded = computed(() => {
		return (
			productDetailsValue.value != null &&
			typeof productDetailsValue.value === 'object' &&
			!Array.isArray(productDetailsValue.value) &&
			Object.keys(productDetailsValue.value).length > 0
		)
	})

	const hasProductDetailError = computed(() => {
		return Boolean(hasError(queryPresets.value.productDetail.name))
	})

	//========================================================================================================================================================

	const getProducts = async (queryParams = {}, targetRef, operationName) => {
		const result = await generalApiOperation({
			operationName: operationName,
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getProducts, {
					params: queryParams,
				})
				return response.data
			},
		})
		if (!result) return

		targetRef.value = result.data
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

	const getSameProducts = (genderId, styleId) => {
		getProducts(
			{
				...queryPresets.value.same,
				gender: genderId,
				styles: styleId,
			},
			sameProducts,
			queryPresets.value.same.name,
		)
	}

	const getSuggestions = async (title) => {
		const params = { ...queryPresets.value.suggestions.queryParams, title }
		const result = await generalApiOperation({
			operationName: queryPresets.value.suggestions.name,
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getSuggestions, {
					params,
				})
				return response.data
			},
		})
		if (!result) return

		suggestions.value = result.data
	}

	const getProductDetails = async (id) => {
		const result = await generalApiOperation({
			operationName: queryPresets.value.productDetail.name,
			operation: async () => {
				const response = await apiClient(
					apiEndpoints.products.getProductDetails(id),
				)
				return response.data
			},
		})
		if (!result) return
		productDetails.value = result.product
	}
	const clearProductDetails = () => {
		productDetails.value = {}
	}

	return {
		// refs
		defaultProducts,
		topSalesProducts,
		newestProducts,
		sameProducts,
		suggestions,
		totalDefaultProductsCount,
		productDetails,

		// computed
		defaultProductsValue,
		suggestionsValue,
		topSalesProductsValue,
		newestProductsValue,
		sameProductsValue,
		queryPresets,
		productDetailsValue,

		// status
		isProductsLoading,
		isSuggestionsLoading,
		isNewestProductsLoading,
		isTopSalesProductsLoading,
		isSameProductsLoading,
		isProductDetailsLoading,
		isProductDetailsLoaded,

		hasNewestProductsError,
		hasTopSalesProductsError,
		hasSameProductsError,
		hasProductDetailError,

		// actions
		getProducts,
		getDefaultProducts,
		getTopSalesProducts,
		getNewestProducts,
		getSameProducts,
		getSuggestions,
		getProductDetails,
		clearProductDetails,
	}
})
