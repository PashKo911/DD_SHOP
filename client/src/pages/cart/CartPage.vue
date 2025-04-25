<template>
	<main-layout>
		<div class="container pt-6 pb-8">
			<breadcrumb-wrapper class="not-last:mb-8" />
			<h1
				class="font-heading text-58-22 leading-tight font-semibold uppercase not-last:mb-6"
			>
				{{ t('pages.cart.title') }}
			</h1>
			<div class="gx-md-40-20 grid items-start gap-8 md:flex">
				<CartList class="grow" />
				<cart-order-summary
					class="md:w-md-644-250 shrink-0 md:sticky md:top-[160px] lg:top-30"
				/>
			</div>
		</div>
	</main-layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import MainLayout from '@/components/layouts/MainLayout.vue'
import BreadcrumbWrapper from '@/components/breadcrumb/BreadcrumbWrapper.vue'
import CartOrderSummary from './CartOrderSummary.vue'
import CartList from './CartList.vue'

const { t } = useI18n()
</script>
