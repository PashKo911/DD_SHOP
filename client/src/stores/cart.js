import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { useGeneralStore } from './general'
import apiClient from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'
import { defineStore, storeToRefs } from 'pinia'
import {
	compareCartItems,
	syncProductsQuantity,
} from '@/utils/cartHelpers/cartHelpers'
import shopConstants from '@/constants/shop'

export const useCartStore = defineStore('cart', () => {
	const generalStore = useGeneralStore()

	const { generalApiOperation, isLoading } = generalStore

	const cartItems = ref([])
	const populatedCart = ref([])
	const isCartInitialized = ref(false)
	//========================================================================================================================================================
	const cartItemsValue = computed(() => {
		return cartItems.value
	})

	const populatedCartValue = computed(() => {
		return populatedCart.value
	})

	const cartSummary = computed(() => {
		const cd = populatedCart.value ?? {}
		return {
			total: cd.total ?? 0,
			totalDiscount: cd.totalDiscount ?? 0,
			totalWithoutDiscount: cd.totalWithoutDiscount ?? 0,
		}
	})

	const populatedItemsValue = computed(() => {
		return populatedCart.value.productsList
	})

	const syncedPopulatedItems = computed(() => {
		const syncedItems = syncProductsQuantity(
			cartItems.value,
			populatedCart.value.productsList,
		)

		return syncedItems
	})

	const cartItemsCount = computed(() => {
		return Array.isArray(cartItems.value)
			? cartItems.value.reduce((acc, p) => p.quantity + acc, 0)
			: 0
	})
	//========================================================================================================================================================

	const isCartItemsMatched = computed(() => {
		return compareCartItems(cartItems.value, populatedItemsValue.value)
	})

	const isInitCartLoading = computed(() => {
		return isLoading('init')
	})

	const isAddToCartLoading = computed(() => {
		return isLoading('addToCart')
	})

	const isUpdateQuantityLoading = computed(() => {
		return isLoading('updateQuantity')
	})

	const isDeleteProductLoading = computed(() => {
		return isLoading('deleteProduct')
	})

	const isCartItemsEmpty = computed(() => {
		return !Array.isArray(cartItems.value) || cartItems.value.length === 0
	})

	const isCartPopulating = computed(() => {
		return isLoading('populateCart')
	})
	//========================================================================================================================================================

	const getLocalCart = () => {
		return (
			JSON.parse(localStorage.getItem(shopConstants.storageKeys.cart)) || []
		)
	}

	const setLocalCart = (newProductsList) => {
		if (!Array.isArray(newProductsList)) return

		localStorage.setItem(
			shopConstants.storageKeys.cart,
			JSON.stringify(newProductsList),
		)
	}

	const initCart = async (cartData) => {
		const authStore = useAuthStore()
		const { isAuthenticated } = storeToRefs(authStore)

		if (!isAuthenticated.value) {
			cartItems.value = cartData ?? getLocalCart()
			isCartInitialized.value = true
			return
		}

		await generalApiOperation({
			operationName: 'init',
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.cart.init,
					getLocalCart(),
				)
				const dbCart = response.data?.cart

				cartItems.value = dbCart
				setLocalCart(dbCart)
				isCartInitialized.value = true
			},
		})
	}

	const populateCart = async () => {
		await generalApiOperation({
			operationName: 'populateCart',
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.cart.populateCart,
					cartItems.value,
				)
				populatedCart.value = response.data?.populatedCart
			},
		})
	}

	const addToCart = async (productData) => {
		const authStore = useAuthStore()
		const { isAuthenticated } = storeToRefs(authStore)

		if (!isAuthenticated.value) {
			const matchedProduct = cartItems.value.find(
				(p) =>
					p.product === productData.product &&
					p.variant === productData.variant &&
					p.size === productData.size,
			)

			if (matchedProduct) matchedProduct.quantity += productData.quantity
			else cartItems.value.push({ ...productData })

			localStorage.setItem(
				shopConstants.storageKeys.cart,
				JSON.stringify(cartItems.value),
			)
			return
		}

		await generalApiOperation({
			operationName: 'addToCart',
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.cart.addProduct,
					productData,
				)
				const dbCart = response.data?.cart

				if (Array.isArray(dbCart)) {
					setLocalCart(dbCart)
					cartItems.value = dbCart
				}
			},
		})
	}

	const updateQuantity = async (productData) => {
		const authStore = useAuthStore()
		const { isAuthenticated } = storeToRefs(authStore)

		if (!isAuthenticated.value) {
			const matchedProduct = cartItems.value.find(
				(p) =>
					p.product === productData.product &&
					p.variant === productData.variant &&
					p.size === productData.size,
			)

			if (matchedProduct) {
				matchedProduct.quantity = productData.quantity
				setLocalCart(cartItems.value)
			}

			return
		}

		await generalApiOperation({
			operationName: 'updateQuantity',
			operation: async () => {
				const response = await apiClient.put(
					apiEndpoints.cart.updateProductQuantity,
					productData,
				)
				const dbProductsList = response.data?.cart
				const dbPopulatedCart = response.data?.populatedCart

				if (Array.isArray(dbProductsList)) {
					setLocalCart(dbProductsList)
					cartItems.value = dbProductsList
				}

				if (dbPopulatedCart) {
					populatedCart.value = dbPopulatedCart
				}
			},
		})
	}

	const deleteProduct = async (productData) => {
		const authStore = useAuthStore()
		const { isAuthenticated } = storeToRefs(authStore)

		if (!isAuthenticated.value) {
			cartItems.value = cartItems.value.filter(
				(p) =>
					!(
						p.product === productData.product &&
						p.variant === productData.variant &&
						p.size === productData.size
					),
			)
			setLocalCart(cartItems.value)
			return
		}

		await generalApiOperation({
			operationName: 'deleteProduct',
			operation: async () => {
				const response = await apiClient.delete(
					apiEndpoints.cart.deleteProduct,
					{ data: productData },
				)

				const dbProductsList = response.data?.cart
				const dbPopulatedCart = response.data?.populatedCart

				if (Array.isArray(dbProductsList)) {
					setLocalCart(dbProductsList)
					cartItems.value = dbProductsList
				}

				if (dbPopulatedCart) {
					populatedCart.value = dbPopulatedCart
				}
			},
		})
	}

	return {
		// refs
		cartItems,
		populatedCart,

		// computed
		cartItemsValue,
		populatedCartValue,
		populatedItemsValue,
		syncedPopulatedItems,
		cartSummary,
		cartItemsCount,

		// status
		isCartItemsMatched,
		isCartItemsEmpty,
		isCartInitialized,
		isInitCartLoading,
		isCartPopulating,
		isAddToCartLoading,
		isUpdateQuantityLoading,
		isDeleteProductLoading,

		// actions
		populateCart,
		initCart,
		addToCart,
		updateQuantity,
		deleteProduct,
	}
})
