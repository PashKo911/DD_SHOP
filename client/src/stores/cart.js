import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { useGeneralStore } from './general'
import apiClient from '@/config/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import { defineStore, storeToRefs } from 'pinia'

export const useCartStore = defineStore('cartList', () => {
	const authStore = useAuthStore()
	const generalStore = useGeneralStore()

	const { isAuthenticated } = storeToRefs(authStore)
	const { generalApiOperation } = generalStore

	const cartList = ref([])
	//========================================================================================================================================================
	const cartListValue = computed(() => {
		return cartList.value
	})
	//========================================================================================================================================================
	const getCart = async () => {}
	const initializeCart = () => {}
	const addToCart = async (product) => {
		if (!isAuthenticated.value) {
		}
		const result = await generalApiOperation({
			operationName: 'addToCart',
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.cartList.addProduct,
					product,
				)
				return response
			},
		})
		console.log(result)
		return result
	}

	return {
		// refs
		cartList,

		// computed
		cartListValue,

		// actions
		addToCart,
	}
})
