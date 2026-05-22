import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useGeneralStore } from './general'

import apiClient from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'
import { queryPresets } from '@/constants/queryPresets'
import shopConstants from '@/constants/shop'

export const useAdminProductsStore = defineStore('adminProducts', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation, isLoading } = generalStore

	const adminProducts = ref(null)
	const editableProduct = ref(null)

	const query = ref({
		page: 0,
		perPage: 10,
		sort: shopConstants.defaultSort.value,
		title: '',
		category: '',
	})
	//========================================================================================================================================================

	const productsValue = computed(() => adminProducts.value?.documents ?? [])
	const total = computed(() => adminProducts.value?.count ?? 0)
	const editableProductValue = computed(() => {
		return editableProduct.value
	})

	const isLoadingTable = computed(() => {
		return isLoading('adminProducts')
	})

	const isAdminProductLoading = computed(() => {
		return isLoading(queryPresets.adminProduct.name)
	})
	const isCreateProductLoading = computed(() => {
		return isLoading(queryPresets.createProduct.name)
	})
	const isUpdateProductLoading = computed(() => {
		return isLoading(queryPresets.updateProduct.name)
	})
	//========================================================================================================================================================

	const getAdminProducts = async (params = {}, signal) => {
		const finalParams = {
			...query.value,
			...params,
		}

		const result = await generalApiOperation({
			operationName: 'adminProducts',
			operation: async () => {
				const response = await apiClient(apiEndpoints.admin.fetchProducts, {
					params: finalParams,
					signal,
				})
				return response.data
			},
		})

		if (!result) return

		adminProducts.value = result.data
	}

	const getAdminProduct = async (id) => {
		const result = await generalApiOperation({
			operationName: queryPresets.adminProduct.name,
			operation: async () => {
				const response = await apiClient(apiEndpoints.admin.getAdminProduct(id))
				return response.data
			},
		})

		if (!result) return null
		editableProduct.value = result.product
		return result.product
	}

	const createProduct = async (formData) => {
		const result = await generalApiOperation({
			operationName: queryPresets.createProduct.name,
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.admin.createProduct,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
				)
				return response.data
			},
		})

		return result?.product ?? null
	}

	const updateProduct = async (id, formData) => {
		const result = await generalApiOperation({
			operationName: queryPresets.updateProduct.name,
			operation: async () => {
				const response = await apiClient.put(
					apiEndpoints.admin.products.updateProduct(id),
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
				)
				return response.data
			},
		})

		return result?.product ?? null
	}
	const deleteProduct = async (id) => {
		const result = await generalApiOperation({
			operationName: queryPresets.deleteProduct.name,
			operation: async () => {
				const response = await apiClient.delete(
					apiEndpoints.admin.deleteProduct(id),
				)
				return response.data
			},
		})

		return result?.product ?? null
	}

	const clearEditableProduct = () => {
		editableProduct.value = null
	}

	const setQuery = (patch) => {
		query.value = {
			...query.value,
			...patch,
		}
	}

	const resetQuery = () => {
		query.value = {
			page: 0,
			perPage: 10,
			sort: 'updatedAt:desc',
			title: '',
			category: '',
		}
	}
	//========================================================================================================================================================

	return {
		// state
		adminProducts,
		query,
		editableProduct,

		// computed
		productsValue,
		total,
		isLoadingTable,
		editableProductValue,
		isAdminProductLoading,
		isCreateProductLoading,
		isUpdateProductLoading,

		// actions
		getAdminProducts,
		setQuery,
		resetQuery,
		getAdminProduct,
		createProduct,
		updateProduct,
		deleteProduct,
		clearEditableProduct,
	}
})
