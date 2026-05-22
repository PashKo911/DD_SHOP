import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useGeneralStore } from './general'
import { useFilterStore } from './filter'

import apiClient from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'
import applyColorFilterToProducts from '@/utils/productsHelpers/applyColorFilterToProducts'
import { queryPresets } from '@/constants/queryPresets'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const filterStore = useFilterStore()

	//========================================================================================================================================================

	const { generalApiOperation, isLoading, hasError } = generalStore
	const { apiQueryParams, filter, perPage } = storeToRefs(filterStore)

	const defaultProducts = ref(null)
	const topSalesProducts = ref([])
	const newestProducts = ref([])
	const sameProducts = ref([])
	const suggestions = ref([])
	const productDetails = ref({})
	const productOptions = ref({
		categories: [],
		styles: [],
		colors: [],
		sizes: [],
	})

	//========================================================================================================================================================

	const defaultPreset = computed(() => {
		return {
			name: 'defaultProducts',
			queryParams: apiQueryParams.value,
		}
	})

	const defaultProductsValue = computed(() => {
		const products = defaultProducts.value?.documents || null

		if (!Array.isArray(products)) {
			return null
		}
		let productsCopy = [...products]

		if (productsCopy.length > perPage.value) {
			productsCopy = productsCopy.slice(0, perPage.value)
		}
		return applyColorFilterToProducts(productsCopy, filter.value.colors)
	})

	const totalDefaultProductsCount = computed(() => {
		return defaultProducts?.value?.count ?? 0
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
	const productOptionsValue = computed(() => {
		return productOptions.value
	})
	//========================================================================================================================================================

	const isSuggestionsLoading = computed(() => {
		return isLoading(queryPresets.suggestions.name)
	})

	const isProductsLoading = computed(() => {
		return isLoading(defaultPreset.value.name)
	})

	const isNewestProductsLoading = computed(() => {
		return isLoading(queryPresets.newest.name)
	})

	const hasNewestProductsError = computed(() => {
		return Boolean(hasError(queryPresets.newest.name))
	})

	const isTopSalesProductsLoading = computed(() => {
		return isLoading(queryPresets.topSales.name)
	})
	const hasTopSalesProductsError = computed(() => {
		return Boolean(hasError(queryPresets.topSales.name))
	})

	const isSameProductsLoading = computed(() => {
		return isLoading(queryPresets.same.name)
	})

	const hasSameProductsError = computed(() => {
		return Boolean(hasError(queryPresets.same.name))
	})

	const isProductDetailsLoading = computed(() => {
		return isLoading(queryPresets.productDetail.name)
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
		return Boolean(hasError(queryPresets.productDetail.name))
	})
	const isProductOptionsLoading = computed(() => {
		return isLoading(queryPresets.productOptions.name)
	})

	//========================================================================================================================================================

	const getProducts = async (
		queryParams = {},
		targetRef,
		operationName,
		signal,
	) => {
		const result = await generalApiOperation({
			operationName: operationName,
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getProducts, {
					params: queryParams,
					signal,
				})
				return response.data
			},
		})
		if (!result) return

		targetRef.value = result.data
	}

	const getDefaultProducts = async (signal) =>
		getProducts(
			defaultPreset.value.queryParams,
			defaultProducts,
			defaultPreset.value.name,
			signal,
		)

	const getTopSalesProducts = async (signal) =>
		getProducts(
			queryPresets.topSales.queryParams,
			topSalesProducts,
			queryPresets.topSales.name,
			signal,
		)
	const getNewestProducts = async (signal) =>
		getProducts(
			queryPresets.newest.queryParams,
			newestProducts,
			queryPresets.newest.name,
			signal,
		)

	const getSameProducts = (categoryId, styleId, signal) => {
		getProducts(
			{
				...queryPresets.same,
				category: categoryId,
				styles: styleId,
			},
			sameProducts,
			queryPresets.same.name,
			signal,
		)
	}

	const getSuggestions = async (title) => {
		const params = { ...queryPresets.suggestions.queryParams, title }
		const result = await generalApiOperation({
			operationName: queryPresets.suggestions.name,
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

	const getProductDetails = async (id, signal) => {
		const result = await generalApiOperation({
			operationName: queryPresets.productDetail.name,
			operation: async () => {
				const response = await apiClient(
					apiEndpoints.products.getProductDetails(id),
					{ signal },
				)
				return response.data
			},
		})
		if (!result) return
		productDetails.value = result.product
	}

	const getProductOptions = async () => {
		const result = await generalApiOperation({
			operationName: queryPresets.productOptions.name,
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getOptions)
				return response.data
			},
		})

		if (!result) return null

		productOptions.value = {
			categories: result.categories ?? [],
			styles: result.styles ?? [],
			colors: result.colors ?? [],
			sizes: result.sizes ?? [],
		}

		return productOptions.value
	}

	const clearDefaultProducts = () => {
		defaultProducts.value = []
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
		productOptions,

		// computed
		defaultProductsValue,
		suggestionsValue,
		topSalesProductsValue,
		newestProductsValue,
		sameProductsValue,
		queryPresets,
		productDetailsValue,
		productOptionsValue,

		// status
		isProductsLoading,
		isSuggestionsLoading,
		isNewestProductsLoading,
		isTopSalesProductsLoading,
		isSameProductsLoading,
		isProductDetailsLoading,
		isProductDetailsLoaded,
		isProductOptionsLoading,
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
		getProductOptions,
		clearProductDetails,
		clearDefaultProducts,
	}
})
