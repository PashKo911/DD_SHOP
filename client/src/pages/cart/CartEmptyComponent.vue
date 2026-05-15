<template>
	<div class="grid h-full place-items-center gap-8">
		<img
			:src="emptyCartImg"
			:alt="t('pages.cart.emptyCart.title')"
			width="340"
			height="325"
			class="w-full max-w-[340px]"
		/>
		<div class="grid gap-4 text-center">
			<h2 class="text-58-22 font-heading leading-tight font-semibold uppercase">
				{{ t('pages.cart.emptyCart.title') }}
			</h2>
			<p class="text-24-18 font-heading leading-tight">
				{{ t('pages.cart.emptyCart.text') }}
			</p>
		</div>
		<button-link
			:to="{
				name: routeNames.SHOP,
				params: { category: shopConstants.defaultCategory },
			}"
			size="large"
			:label="t('buttons.continueShopping')"
		/>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import emptyCartImg from '@/assets/img/cart/emptyImg.svg'
import ButtonLink from '@/components/ui/buttons/ButtonLink.vue'
import routeNames from '@/router/routeNames'
import shopConstants from '@/constants/shop'

const { t } = useI18n()
</script>
