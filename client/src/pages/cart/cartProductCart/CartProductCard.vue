<template>
	<article
		class="not-last:pb-24-16 not-last:mb-24-16 not-last:border-border-color grid gap-4 not-last:border-b sm:flex"
	>
		<router-link
			:to="{
				name: routeNames.PRODUCT_DETAIL,
				params: routeParams,
			}"
			class="group focus-visible:outline-primary relative aspect-[160/240] shrink-0 overflow-hidden rounded-md outline-1 outline-transparent sm:w-40"
			:class="{
				'pointer-events-none': isCardLoading,
			}"
		>
			<img
				:src="`${apiConfig.apiBase}${productData.image}`"
				:alt="productData.title"
				class="transition-all duration-300 group-hover:scale-105"
				:class="{
					'opacity-50': isCardLoading,
				}"
			/>
			<spinner-icon
				v-if="isCardLoading"
				class="stroke-primary absolute top-1/2 left-1/2 w-20 -translate-x-1/2 -translate-y-1/2"
			/>
		</router-link>
		<div class="flex grow flex-col justify-between">
			<div class="not-last:mb-4">
				<div
					class="flex items-start justify-between gap-3 not-last:mb-4 max-sm:items-center"
				>
					<h3>
						<button-link
							:to="{
								name: routeNames.PRODUCT_DETAIL,
								params: routeParams,
							}"
							variant="text"
							class="text-[1.5rem]"
							:class="{
								'pointer-events-none cursor-default': isCardLoading,
							}"
						>
							<span>
								{{ productData.title }}
							</span>
						</button-link>
					</h3>
					<Button
						severity="info"
						:aria-label="t('buttons.deleteProduct')"
						variant="text"
						rounded
						:disabled="isCardLoading"
						@click="onDeleteProduct"
						class="w-8"
					>
						<template #icon>
							<close-icon
								class="fill-primary transition-transform duration-300 group-hover:scale-120"
							/>
						</template>
					</Button>
				</div>
				<p
					class="font-heading text-lg leading-tight capitalize not-last:mb-2 sm:text-xl"
				>
					<span> {{ t('pages.cart.cartProductCard.color') }}: </span>
					<span>
						{{ productData.color?.label }}
					</span>
				</p>
				<p
					class="font-heading text-lg leading-tight capitalize not-last:mb-4 sm:text-xl"
				>
					<span> {{ t('pages.cart.cartProductCard.size') }}: </span>
					<span class="uppercase"> {{ productData.size?.label }} </span>
				</p>
				<span class="font-heading text-[1.5rem] leading-tight font-medium">
					{{ n(productData.totalPrice, 'currency') }}
				</span>
			</div>
			<div
				class="flex flex-wrap items-start justify-between gap-6 max-sm:items-center"
			>
				<input-number
					:default-value="productData.amount"
					showButtons
					:aria-label="
						$t('accessibility.amountInput', { title: productData.title })
					"
					:step="1"
					:min="1"
					buttonLayout="horizontal"
					size="small"
					:disabled="isCardLoading"
					@input="onUpdateAmount"
					class="ml-auto"
				/>
			</div>
		</div>
	</article>
</template>

<script setup>
import { computed } from 'vue'

import apiConfig from '@/config/api'
import debounce from '@/utils/debounce'
import slugify from '@sindresorhus/slugify'
import { makeKeyFromCartItem } from '@/utils/cartHelpers/cartHelpers'

import { useI18n } from 'vue-i18n'

import InputNumber from '@/components/ui/InputNumber.vue'
import Button from '@/components/ui/buttons/Button.vue'
import ButtonLink from '@/components/ui/buttons/ButtonLink.vue'
import routeNames from '@/router/routeNames'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const { t, n } = useI18n()

const props = defineProps({
	productData: {
		type: Object,
		required: true,
	},
	isSpinnerVisible: {
		type: Boolean,
		default: false,
	},
	processingItemKey: {
		type: String,
	},
})

const emit = defineEmits(['amount-updated', 'delete-product'])

const debouncedUpdateEmit = debounce((newVal) => {
	const product = props.productData?.productId
	const variant = props.productData?.variant
	const size = props.productData?.size?._id

	const productData = {
		product,
		variant,
		size,
		amount: newVal,
	}

	emit('amount-updated', productData)
})
//========================================================================================================================================================

const routeParams = computed(() => {
	return {
		category: props.productData.categoryKey,
		slug: slugify(props.productData.title),
		id: props.productData.productId,
		variant: props.productData.variant,
		size: props.productData?.size?._id,
	}
})

const isCardLoading = computed(() => {
	const currentIdStr = makeKeyFromCartItem(props.productData, true, false)
	return props.isSpinnerVisible && currentIdStr === props.processingItemKey
})
//========================================================================================================================================================

const onUpdateAmount = ({ value }) => {
	debouncedUpdateEmit(value)
}

const onDeleteProduct = () => {
	const productData = {
		product: props.productData?.productId,
		variant: props.productData?.variant,
		size: props.productData?.size?._id,
	}
	emit('delete-product', productData)
}
</script>
