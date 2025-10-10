<template>
	<router-link
		:to="{ name: routeNames.CART }"
		:aria-label="t('accessibility.cartLink')"
		class="focus-visible:outline-t-inverse-hover relative z-30 order-3 flex items-center rounded-sm outline outline-transparent md:order-2"
	>
		<cart-icon
			class="fill-inverse hover:fill-t-inverse-hover [.router-link-active_&]:fill-t-inverse-hover"
		/>
		<span
			v-if="cartItemsCount"
			class="bg-creamy-cloud font-heading absolute top-0 left-0 flex aspect-square min-w-[1.125rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-[.125rem] text-[.75rem] leading-1 font-semibold"
		>
			{{ cartItemsCount }}
		</span>
	</router-link>
</template>

<script setup>
import routeNames from '@/router/routeNames'

import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'

import CartIcon from '@/components/icons/CartIcon.vue'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const cartStore = useCartStore()

const { cartItemsCount } = storeToRefs(cartStore)
</script>
