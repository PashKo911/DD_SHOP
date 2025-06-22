<template>
	<div
		class="grid gap-5"
		:class="{
			'grid-cols-3': viewMode === '3',
			'grid-cols-4': viewMode === '4',
		}"
	>
		<product-card v-for="p in items" :key="p.id" :data="p" />
	</div>
</template>

<script setup>
import ProductCard from '@/components/cards/ProductCard.vue'

defineProps({
	items: {
		type: Array,
		required: true,
	},
	viewMode: {
		type: String,
		default: '3',
	},
})
</script>
