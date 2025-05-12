<template>
	<div class="grid grid-cols-3 gap-5 gap-x-5 gap-y-15">
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
})
</script>
