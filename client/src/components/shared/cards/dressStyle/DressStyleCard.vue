<template>
	<router-link
		:to="{
			name: routeNames.SHOP,
			params: { category: shopConstants.defaultCategory },
			query: {
				styles: productData.slug,
			},
		}"
		class="bg-primary p-maxmd-70-20 md:p-md-70-20 group relative flex aspect-[808/292] basis-[53.656915%] overflow-hidden rounded-lg nth-[4n+1]:aspect-[665/292] nth-[4n+1]:basis-[44.215426%] nth-[4n+4]:aspect-[665/292] nth-[4n+4]:basis-[44.215426%] sm:rounded-xl md:rounded-2xl"
		:class="{
			'justify-end': index === 2 || index === 1,
		}"
	>
		<div
			class="flex flex-col items-center"
			:class="{
				'self-end': index === 1 || index === 2,
			}"
		>
			<h3
				class="font-heading text-creamy-cloud text-max-md-55-28 md:text-md-55-38 relative z-[2] leading-tight font-semibold capitalize"
			>
				{{ productData.label }}
			</h3>
			<arrow-down-simple
				class="group-hover:animate-soft-bounce w-4 self-center justify-self-center sm:w-7"
			/>
		</div>
		<img
			:src="`${apiConfig.apiBase}${productData.imgSrc}`"
			:alt="productData.label"
			:loading="lazyAttr"
			:width="imgConfig.width"
			:height="imgConfig.height"
			class="pointer-events-none absolute top-0"
			:class="imgConfig.class"
		/>
	</router-link>
</template>

<script setup>
import { computed } from 'vue'
import apiConfig from '@/config/api'
import shopConstants from '@/constants/shop'

import ArrowDownSimple from '@/components/icons/ArrowDownSimple.vue'
import routeNames from '@/router/routeNames'

const props = defineProps({
	productData: {
		type: Object,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
	lazy: {
		type: Boolean,
		default: true,
	},
})

const imageConfigs = [
	{
		class: 'right-0 w-[70.37594%]',
		width: 468,
		height: 292,
	},
	{
		class: 'left-0 w-[41.831683%]',
		width: 338,
		height: 292,
	},
	{
		class: 'left-0 w-[47.95539%]',
		width: 387,
		height: 292,
	},
	{
		class: 'right-0 w-[60.300752%]',
		width: 401,
		height: 292,
	},
]

const lazyAttr = computed(() => {
	return props.lazy ? 'lazy' : 'eager'
})

const imgConfig = computed(() => {
	return imageConfigs[props.index] || imageConfigs[0]
})
</script>
