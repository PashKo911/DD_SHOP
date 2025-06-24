<template>
	<div class="grid content-start gap-4 lg:gap-5" :class="columnsClass">
		<product-card v-for="item in items" :key="item.id" :data="item" />
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import ProductCard from '@/components/cards/ProductCard.vue'

const props = defineProps({
	items: {
		type: Array,
		default: () => [],
	},
	viewMode: {
		type: Number,
		default: 3,
	},
})

const isMobileSmall = useMediaQuery('(min-width: 510px)')
const isMobile = useMediaQuery('(min-width: 660px)')

const columnsMap = {
	3: [1, 2, 3],
	4: [2, 3, 4],
}
const classMap = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
}

const columnsClass = computed(() => {
	const config = columnsMap[props.viewMode] || columnsMap[3]
	let cols
	switch (true) {
		case isMobile.value:
			cols = config[2]
			break
		case isMobileSmall.value:
			cols = config[1]
			break
		default:
			cols = config[0]
	}
	return classMap[cols]
})
</script>
