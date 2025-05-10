<template>
	<article class="flex h-full flex-col">
		<div
			class="grid aspect-square place-items-center rounded-2xl bg-white shadow-lg not-last:mb-4"
		>
			<img :src="data.imgSrc" :alt="data.title" />
		</div>
		<div class="grow not-last:mb-2">
			<h3 class="font-heading line-clamp-2 text-2xl font-bold">
				{{ data.title }}
			</h3>
		</div>
		<rating-comp v-model="data.rating" readonly class="not-last:mb-2" />
		<div class="flex flex-wrap items-center gap-3 not-last:mb-4">
			<span class="text-2xl leading-tight font-semibold">
				${{ data.price }}
			</span>
			<span
				v-show="getDiscount(data.oldPrice, data.price)"
				class="text-dark-grey text-2xl leading-tight font-semibold line-through decoration-2"
			>
				${{ data.oldPrice }}
			</span>
			<Badge
				v-show="getDiscount(data.oldPrice, data.price)"
				severity="success"
				circle
				size="xlarge"
				:value="getDiscount(data.oldPrice, data.price)"
			/>
		</div>
	</article>
</template>

<script setup>
import RatingComp from '@/components/ui/rating/RatingComp.vue'
import Badge from '@/components/ui/budge/Badge.vue'
import getDiscount from '@/utils/getDiscount'

defineProps({
	data: {
		type: Object,
		required: true,
	},
})
</script>
