<template>
	<div class="p-35-15 border-border-color rounded-xl border">
		<component
			:is="activeCardComponent"
			v-for="(p, i) in itemsForRender"
			:key="isSkeletonVisible ? i : `${p.productId}${p.variant}${p.size?._id}`"
			:product-data="p"
			:processing-item-key="processingItemKey"
			:is-spinner-visible="isSpinnerVisible"
			@amount-updated="emit('amount-updated', $event)"
			@delete-product="emit('delete-product', $event)"
		/>
	</div>
</template>

<script setup>
import { computed } from 'vue'

import CartProductCard from './cartProductCart/CartProductCard.vue'
import CartProductCardSkeleton from './cartProductCart/CartProductCardSkeleton.vue'

const props = defineProps({
	cartList: {
		type: Array,
		default: [],
	},
	isSkeletonVisible: {
		type: Boolean,
		default: false,
	},
	isSpinnerVisible: {
		type: Boolean,
		default: false,
	},
	processingItemKey: {
		type: String,
	},
})

const emit = defineEmits(['amount-updated', 'delete-product'])

const minCardsCount = 2

const activeCardComponent = computed(() => {
	return props.isSkeletonVisible ? CartProductCardSkeleton : CartProductCard
})

const itemsForRender = computed(() => {
	return props.isSkeletonVisible
		? Array.from({ length: minCardsCount })
		: props.cartList
})
</script>
