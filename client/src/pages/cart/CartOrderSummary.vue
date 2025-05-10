<template>
	<div class="p-35-15 border-border-color rounded-xl border">
		<h2
			class="text-32-26 font-heading leading-tight font-semibold capitalize not-last:mb-[1.375rem]"
		>
			{{ t('pages.cart.orderSummary.title') }}
		</h2>
		<div class="border-border-color border-b pb-4 not-last:mb-6">
			<p class="flex items-center justify-between gap-6 not-last:mb-6">
				<span
					class="text-dark-grey font-heading text-24-18 leading-tight capitalize"
				>
					{{ t('pages.cart.orderSummary.subtotal') }}
				</span>
				<span class="text-32-26 font-heading leading-tight capitalize">
					$ 778
				</span>
			</p>
			<p class="flex items-center justify-between gap-6 not-last:mb-6">
				<span
					class="text-dark-grey font-heading text-24-18 leading-tight capitalize"
				>
					{{ t('pages.cart.orderSummary.discount') }}
				</span>
				<span
					class="text-32-26 font-heading leading-tight text-red-500 capitalize"
				>
					$ -194
				</span>
			</p>
		</div>
		<p class="mb-50-30 flex items-center justify-between gap-6">
			<span class="font-heading text-24-18 leading-tight font-bold capitalize">
				{{ t('pages.cart.orderSummary.total') }}
			</span>
			<span class="font-heading text-32-26 leading-tight font-bold capitalize">
				$ 525
			</span>
		</p>
		<Button :label="t('buttons.cartCheckout')" iconPos="right" class="w-full">
			<template #icon>
				<arrow-icon
					class="group-hover:fill-primary fill-creamy-cloud relative order-1 shrink-0 transition-colors"
				/>
			</template>
		</Button>
	</div>
</template>

<script setup>
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
