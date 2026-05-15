<template>
	<div class="grid content-start gap-4 lg:gap-5" :class="columnsClass">
		<template v-if="isLoading || items === null">
			<product-card-skeleton v-for="n in renderList" :key="n" />
		</template>
		<empty-list v-else-if="items.length === 0" class="pt-[6vw]">
			<template #title>
				{{ t('pages.shop.emptyBlock.title') }}
			</template>
			<template #text>
				{{ t('pages.shop.emptyBlock.text') }}
			</template>
		</empty-list>

		<product-card
			v-else
			v-for="(item, idx) in renderList"
			:key="idx"
			:data="item"
		/>
	</div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'

import EmptyList from '@/components/dataTable/EmptyList.vue'
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
const { t } = useI18n()

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
	if (props.items?.length === 0 && !props.isLoading) {
		return classMap[0]
	}
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
	return props.isLoading || !props.items.length
		? ProductCardSkeleton
		: ProductCard
})

const renderList = computed(() => {
	if (props.isLoading || props.items === null) {
		return Array.from({
			length: skeletonsCount.value,
		})
	}
	return props.items
})
</script>
