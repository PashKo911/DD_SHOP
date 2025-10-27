<template>
	<div class="grid content-start gap-4 lg:gap-5" :class="columnsClass">
		<component
			v-for="(item, idx) in renderList"
			:is="activeComponent"
			:key="idx"
			:data="isLoading ? {} : item"
		/>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

import ProductCard from '@/components/cards/productCard/ProductCard.vue'
import ProductCardSkeleton from '@/components/cards/productCard/ProductCardSkeleton.vue'

const props = defineProps({
	items: {
		type: Array,
		default: () => [],
	},
	viewMode: {
		type: Number,
		default: 3,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
})

const isMobileSmall = useMediaQuery('(min-width: 510px)')
const isMobile = useMediaQuery('(min-width: 660px)')

const columnsMap = {
	3: [1, 2, 3],
	4: [2, 3, 4],
}
const rowsMap = {
	3: [1, 2, 3],
	4: [2, 2, 3],
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

const skeletonsCount = computed(() => {
	const rowsConfig = rowsMap[props.viewMode] || rowsMap[3]
	const colsConfig = columnsMap[props.viewMode] || columnsMap[3]
	let res

	switch (true) {
		case isMobile.value:
			res = rowsConfig[2] * colsConfig[2]
			break
		case isMobileSmall.value:
			res = rowsConfig[1] * colsConfig[1]
			break
		default:
			res = rowsConfig[0] * colsConfig[0]
	}
	return res
})

const activeComponent = computed(() => {
	return props.isLoading ? ProductCardSkeleton : ProductCard
})

const renderList = computed(() => {
	if (props.isLoading) {
		return Array.from({
			length: skeletonsCount.value,
		})
	}
	return props.items
})
</script>
