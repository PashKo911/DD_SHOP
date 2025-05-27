import { defineStore } from 'pinia'
import { useGeneralStore } from './general'
import { useFilterStore } from './filter'
import { storeToRefs } from 'pinia'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import { computed, ref } from 'vue'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const filterStore = useFilterStore()

	const { generalApiOperation } = generalStore
	const { apiQueryParams } = storeToRefs(filterStore)

	const products = ref([])
	const count = ref(null)

	const productsValue = computed(() => {
		return products.value
	})

	const getProducts = async () => {
		const res = await generalApiOperation({
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getProducts, {
					params: apiQueryParams.value,
				})
				return response.data.products
			},
		})

		count.value = res.count
		products.value = res.documents
	}
	return {
		products,
		productsValue,
		getProducts,
		count,
	}
})
