<template>
	<RouterLink
		:to="{ name: 'productDetail', params: { productId: data._id } }"
		class="@container flex h-full flex-col pb-4 duration-500 hover:bg-white hover:shadow-lg"
	>
		<div
			class="group relative aspect-[3/3.6] overflow-hidden bg-white not-last:mb-4"
		>
			<img
				:src="`${API_BASE}${data.paths[0]}`"
				:alt="data.title"
				class="absolute inset-0"
			/>
			<img
				:src="`${API_BASE}${data.paths[1]}`"
				:alt="data.title"
				class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			/>
			<span
				v-if="data.discount"
				:aria-label="
					t('accessibility.discountLabel', { discount: data.discount })
				"
				class="test-child bg-primary absolute top-0 right-0 p-1.5 text-xl text-[6.5cqw] font-semibold text-white"
			>
				{{ data.discount }}
			</span>
		</div>
		<div class="flex flex-col gap-2 px-2.5">
			<div class="grow">
				<h3
					class="font-heading line-clamp-2 text-[7.5cqw] leading-tight font-bold"
				>
					{{ data.title }}
				</h3>
			</div>
			<div class="grid gap-2">
				<rating-comp v-model="data.rating" readonly />
				<div class="flex flex-wrap items-center gap-8">
					<span class="text-[7cqw] leading-tight font-semibold">
						{{ data.price }}
					</span>
					<span
						class="text-dark-grey text-[6cqw] leading-tight font-semibold line-through decoration-2"
					>
						{{ data.oldPrice }}
					</span>
				</div>
			</div>
			<div>
				<ul class="flex items-center gap-1.5">
					<li
						v-for="s in data.sizes"
						:key="s._id"
						class="font-heading text-[7cqw] font-bold"
					>
						{{ s.label }}
					</li>
				</ul>
				<ul class="flex items-center gap-1.5">
					<li
						v-for="c in data.colors"
						:key="c._id"
						:aria-label="locale === 'uk' ? c.labelUk : c.label"
						:style="{ backgroundColor: c.value }"
						class="aspect-square w-8 rounded-full"
					></li>
				</ul>
			</div>
		</div>
	</RouterLink>
</template>

<script setup>
import { API_BASE } from '@/config/apiConfig'

import { useI18n } from 'vue-i18n'

import RatingComp from '@/components/ui/rating/RatingComp.vue'

defineProps({
	data: {
		type: Object,
		required: true,
	},
})

const { t, locale } = useI18n()
</script>
