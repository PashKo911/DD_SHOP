<template>
	<router-link
		:to="{
			name: 'shop',
			params: { category: 'women' },
			query: {
				styles: productData.label,
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
				{{ productData.labelUk ?? productData.label }}
			</h3>
			<arrow-down-simple
				class="group-hover:animate-soft-bounce w-7 self-center justify-self-center"
			/>
		</div>
		<img
			:src="`${API_BASE}${productData.imgSrc}`"
			:alt="productData.labelUk ?? productData.label"
			class="pointer-events-none absolute top-0"
			:class="{
				'right-0 w-[70.37594%]': index === 0,
				'left-0 w-[41.831683%]': index === 1,
				'left-0 w-[47.95539%]': index === 2,
				'right-0 w-[60.300752%]': index === 3,
			}"
		/>
	</router-link>
</template>

<script setup>
import { API_BASE } from '@/config/apiConfig'
import ArrowDownSimple from '@/components/icons/ArrowDownSimple.vue'

defineProps({
	productData: {
		type: Object,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
})
</script>
