<template>
	<div class="container pt-6 pb-8">
		<breadcrumb-wrapper class="not-last:mb-8" />

		<template v-if="!isCartItemsEmpty">
			<h1
				class="font-heading text-58-22 leading-tight font-semibold uppercase not-last:mb-6"
			>
				{{ t('pages.cart.title.page') }}
			</h1>
			<div class="gx-md-40-20 grid items-start gap-8 md:flex">
				<cart-list
					:cart-list="syncedPopulatedItems"
					:is-skeleton-visible="isSkeletonVisible"
					:is-spinner-visible="isSpinnerVisible"
					:processing-item-key="processingItemKey"
					@quantity-updated="onProductQuantityUpdate"
					@delete-product="onDeleteProduct"
					class="grow"
				/>
				<component
					:is="summaryComponent"
					:cart-summary="cartSummary"
					class="md:w-md-644-250 shrink-0 md:sticky md:top-[10rem] lg:top-30"
				/>
			</div>
		</template>
		<cart-empty-component v-else />
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref, computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useCommonStore } from '@/stores/common'
import { useAuthStore } from '@/stores/auth'
import { makeKeyFromCartItem } from '@/utils/cartHelpers/cartHelpers'

import BreadcrumbWrapper from '@/components/breadcrumb/BreadcrumbWrapper.vue'
import CartOrderSummary from './cartOrderSummary/CartOrderSummary.vue'
import CartOrderSummarySkeleton from './cartOrderSummary/CartOrderSummarySkeleton.vue'
import CartList from './CartList.vue'
import CartEmptyComponent from './CartEmptyComponent.vue'

const { t, locale } = useI18n()

const authStore = useAuthStore()
const cartStore = useCartStore()
const commonStore = useCommonStore()

const { isAuthenticated } = storeToRefs(authStore)

const {
	syncedPopulatedItems,
	cartSummary,
	isCartPopulating,
	isCartItemsEmpty,
	isCartInitialized,
	isCartItemsMatched,
	isUpdateQuantityLoading,
	isDeleteProductLoading,
} = storeToRefs(cartStore)

const { populateCart, updateQuantity, deleteProduct } = cartStore
const { currency } = storeToRefs(commonStore)

const isInitialLoad = ref(true)
const processingItemKey = ref(null)
//========================================================================================================================================================
const isSkeletonVisible = computed(() => {
	return Boolean(isCartPopulating.value && isInitialLoad.value)
})

const isSpinnerVisible = computed(() => {
	return Boolean(
		isUpdateQuantityLoading.value ||
			isDeleteProductLoading.value ||
			isCartPopulating.value,
	)
})

const summaryComponent = computed(() => {
	return isSkeletonVisible.value ? CartOrderSummarySkeleton : CartOrderSummary
})

//========================================================================================================================================================

watch(locale, async () => {
	isInitialLoad.value = true
	await populateCart()
	isInitialLoad.value = false
})

watch(currency, async () => {
	isInitialLoad.value = true
	await populateCart()
	isInitialLoad.value = false
})

watch(isCartInitialized, () => {
	if (isCartInitialized.value && !isCartItemsEmpty.value) {
		populateCart()
	}
})
//========================================================================================================================================================

onMounted(async () => {
	if (
		isCartInitialized.value &&
		!isCartItemsEmpty.value &&
		!isCartItemsMatched.value
	) {
		await populateCart()
	}
	isInitialLoad.value = false
})

//========================================================================================================================================================

const onProductQuantityUpdate = async (newData) => {
	processingItemKey.value = makeKeyFromCartItem(newData, false, false)
	await updateQuantity(newData)

	if (!isAuthenticated.value) {
		populateCart()
	}
}

const onDeleteProduct = async (productData) => {
	processingItemKey.value = makeKeyFromCartItem(productData, false, false)
	await deleteProduct(productData)

	if (!isAuthenticated.value) {
		populateCart()
	}
}
</script>
