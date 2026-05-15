<template>
	<section
		class="lg:gx-lg-80-12 not-last:mb-100-60 flex flex-col items-start justify-between gap-x-4 gap-y-10 lg:flex-row"
	>
		<component
			:is="activeThumbSwiperComponent"
			v-bind="sliderAttributes"
			class="lg:shrink-0 lg:basis-[max(40%,_32.5rem)]"
		/>
		<component
			:is="activeDescriptionComponent"
			v-bind="descriptionAttributes"
			@change-variant="onVariantChange"
			@form-submit="onFormSubmit"
			class="w-full lg:grow"
		/>
	</section>

	<product-detail-tabs
		:reviews="reviewsValue"
		:is-reviews-loading="isReviewsLoading"
		:description="productDetailsValue.description"
		class="not-last:mb-100-60"
	/>

	<section>
		<div>
			<h2
				class="font-heading not-last:mb-50-30 text-50-28 leading-tight font-semibold uppercase"
			></h2>
		</div>
		<slider-base
			:items="sameProductsValue"
			:title="t('pages.productDetail.title.sameProductsSection')"
			:is-loading="isSameProductsLoading"
			:has-error="hasSameProductsError"
			@reload-items="
				() =>
					getSameProducts(
						productDetailsValue.category._id,
						productDetailsValue.style._id,
					)
			"
		/>
	</section>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { computed, watch, onMounted, ref, onUnmounted } from 'vue'
import slugify from '@sindresorhus/slugify'

import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores/common'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useReviewsStore } from '@/stores/reviews'
import { useCartStore } from '@/stores/cart'

import { i18nMeta } from '@/config/i18n'

import SliderThumb from '@/components/sliders/sliderThumb/SliderThumb.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import ProductDetailDescription from './productDetailDescription/ProductDetailDescription.vue'
import ProductDetailDescriptionSkeleton from './productDetailDescription/ProductDetailDescriptionSkeleton.vue'
import ProductDetailTabs from './ProductDetailTabs.vue'
import SliderThumbSkeleton from '@/components/sliders/sliderThumb/SliderThumbSkeleton.vue'

const props = defineProps({
	locale: {
		type: String,
		default: i18nMeta.defaultLocale,
	},
	category: {
		type: String,
		required: true,
	},
	slug: {
		type: [String, Number],
		required: true,
	},
	id: {
		type: [String, Number],
		required: true,
	},
	variant: {
		type: [String, Number],
		required: true,
	},
	size: {
		type: [String, Number],
	},
})

const productsStore = useProductsStore()
const cartStore = useCartStore()
const reviewsStore = useReviewsStore()
const commonStore = useCommonStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const { locale, currency } = storeToRefs(commonStore)

const { getProductDetails, clearProductDetails, getSameProducts } =
	productsStore
const {
	productDetailsValue,
	isProductDetailsLoading,
	isProductDetailsLoaded,
	sameProductsValue,
	isSameProductsLoading,
	hasSameProductsError,
} = storeToRefs(productsStore)

const { addToCart } = cartStore
const { isAddToCartLoading } = storeToRefs(cartStore)

const { reviewsValue, isReviewsLoading, hasReviewsError } =
	storeToRefs(reviewsStore)
const { getReviews } = reviewsStore
//========================================================================================================================================================

const activeProductVariant = computed(() => {
	if (!isProductDetailsLoaded.value || !productDetailsValue.value.variants)
		return null
	const colors = productDetailsValue.value.variants.map((v) => v.color)

	const activeVariant = productDetailsValue.value.variants.find(
		({ _id }) => _id === props.variant,
	)

	if (!activeVariant) return null
	const initialSize = props.size ?? null

	const { variants, ...restProduct } = productDetailsValue.value
	return { colors, initialSize, ...restProduct, ...activeVariant }
})

const activeThumbSwiperComponent = computed(() => {
	return isProductDetailsLoading.value || !isProductDetailsLoaded.value
		? SliderThumbSkeleton
		: SliderThumb
})
const descriptionAttributes = computed(() => {
	if (isProductDetailsLoading.value || !isProductDetailsLoaded.value) {
		return {}
	}
	return {
		productData: activeProductVariant.value,
		isLoading: isAddToCartLoading.value,
		altImageAttr: activeProductVariant?.value.title,
	}
})
const activeDescriptionComponent = computed(() => {
	return isProductDetailsLoading.value || !isProductDetailsLoaded.value
		? ProductDetailDescriptionSkeleton
		: ProductDetailDescription
})
const sliderAttributes = computed(() => {
	if (isProductDetailsLoading.value || !isProductDetailsLoaded.value) {
		return {}
	}
	return { imagesList: activeProductVariant.value.images }
})
//========================================================================================================================================================

watch(locale, async () => {
	await getProductDetails(props.id)
	getSameProducts(
		productDetailsValue.value.category._id,
		productDetailsValue.value.style._id,
	)
	router.replace({
		name: route.name,
		params: {
			...route.params,
			slug: slugify(activeProductVariant.value.title),
		},
	})
})

watch(currency, async () => {
	await getProductDetails(props.id)
	getSameProducts(
		productDetailsValue.value.category._id,
		productDetailsValue.value.style._id,
	)
})

watch(
	() => props.id,
	async (newId) => {
		await getProductDetails(newId)
		getSameProducts(
			productDetailsValue.value.category._id,
			productDetailsValue.value.style._id,
		)
	},
)

onMounted(async () => {
	await getProductDetails(props.id)
	getReviews()
	getSameProducts(
		productDetailsValue.value.category._id,
		productDetailsValue.value.style._id,
	)
})
onUnmounted(clearProductDetails)
//========================================================================================================================================================
const onVariantChange = (newColorId) => {
	const variant = productDetailsValue.value.variants.find(
		(v) => v.color._id === newColorId,
	)

	if (!variant) return

	const variantId = variant._id
	const newParams = { ...route.params, variant: variantId }

	router.replace({ name: route.name, params: newParams })
}

const onFormSubmit = ({ count, size }) => {
	const product = {
		product: props.id,
		variant: props.variant,
		size,
		quantity: count,
	}
	addToCart(product)
}
</script>
