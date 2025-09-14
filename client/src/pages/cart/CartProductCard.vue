<template>
	<article
		class="not-last:pb-24-16 not-last:mb-24-16 not-last:border-border-color grid gap-4 not-last:border-b sm:flex sm:items-start"
	>
		<div class="shrink-0 overflow-hidden rounded-md sm:w-44">
			<img :src="productData.imgSrc" :alt="productData.title" />
		</div>
		<div class="grow">
			<div
				class="flex items-start justify-between gap-3 not-last:mb-4 max-sm:items-center"
			>
				<h3
					class="font-heading text-24-18 line-clamp-1 leading-tight font-semibold capitalize"
				>
					{{ productData.title }}
				</h3>
				<Button
					severity="info"
					:aria-label="t('buttons.deleteProduct')"
					variant="text"
					rounded
				>
					<template #icon>
						<delete-icon
							class="fill-red-400 transition-colors group-hover:fill-red-600"
						/>
					</template>
				</Button>
			</div>
			<p
				class="font-heading text-lg leading-tight capitalize not-last:mb-2 sm:text-xl"
			>
				<span> {{ t('pages.cart.cartProductCard.color') }}: </span>
				<span>
					{{ productData.color }}
				</span>
			</p>
			<p
				class="font-heading text-lg leading-tight capitalize not-last:mb-4 sm:text-xl"
			>
				<span> {{ t('pages.cart.cartProductCard.size') }}: </span>
				<span class="uppercase"> {{ productData.size }} </span>
			</p>
			<div
				class="flex flex-wrap items-start justify-between gap-6 max-sm:items-center"
			>
				<span
					class="font-heading text-32-26 leading-tight font-medium capitalize"
				>
					$ {{ productData.price }}
				</span>
				<InputNumber
					:inputId="productData._id"
					showButtons
					buttonLayout="horizontal"
					:step="1"
					:min="1"
					size="small"
					class="ml-auto"
				/>
			</div>
		</div>
	</article>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import InputNumber from '@/components/ui/InputNumber.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import Button from '@/components/ui/buttons/Button.vue'

const { t } = useI18n()

defineProps({
	productData: {
		type: Object,
		required: true,
	},
})
</script>
