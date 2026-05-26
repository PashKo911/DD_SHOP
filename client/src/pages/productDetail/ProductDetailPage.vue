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
			@reload-items="reloadSameProducts"
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
import { useWatcherAbortController } from '@/composables/useWatcherAbortController'

import SliderThumb from '@/components/shared/sliders/sliderThumb/SliderThumb.vue'
import SliderThumbSkeleton from '@/components/shared/sliders/sliderThumb/SliderThumbSkeleton.vue'

import SliderBase from '@/components/shared/sliders/base/SliderBase.vue'
import ProductDetailDescription from './productDetailDescription/ProductDetailDescription.vue'
import ProductDetailDescriptionSkeleton from './productDetailDescription/ProductDetailDescriptionSkeleton.vue'
import ProductDetailTabs from './ProductDetailTabs.vue'

// ----------------------------------------------------------------------

const props = defineProps({
	locale: { type: String, default: i18nMeta.defaultLocale },
	category: { type: String, required: true },
	slug: { type: [String, Number], required: true },
	id: { type: [String, Number], required: true },
	variant: { type: [String, Number], required: true },
	size: { type: [String, Number] },
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const productsStore = useProductsStore()
const reviewsStore = useReviewsStore()
const cartStore = useCartStore()
const commonStore = useCommonStore()

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
const { reviewsValue, isReviewsLoading } = storeToRefs(reviewsStore)
const { getReviews } = reviewsStore

// ----------------------------------------------------------------------

const activeProductVariant = ref(null)

// ----------------------------------------------------------------------

const buildActiveVariant = () => {
	if (!productDetailsValue.value?.variants) return null

	const variants = productDetailsValue.value.variants

	const found = variants.find((v) => v._id === props.variant)
	if (!found) return null

	const colors = variants.map((v) => v.color)
	const initialSize = props.size ?? null

	const { variants: _omit, ...rest } = productDetailsValue.value

	return {
		...rest,
		...found,
		colors,
		initialSize,
	}
}

const syncActiveVariant = () => {
	const v = buildActiveVariant()
	if (v) activeProductVariant.value = v
}

// ----------------------------------------------------------------------
// UI guards

const isReady = computed(() => !!activeProductVariant.value?.images)

// ----------------------------------------------------------------------

const activeThumbSwiperComponent = computed(() =>
	isProductDetailsLoading.value || !isReady.value
		? SliderThumbSkeleton
		: SliderThumb,
)

const activeDescriptionComponent = computed(() =>
	isProductDetailsLoading.value || !isReady.value
		? ProductDetailDescriptionSkeleton
		: ProductDetailDescription,
)

// ----------------------------------------------------------------------

const descriptionAttributes = computed(() => {
	if (!isReady.value) return {}

	return {
		productData: activeProductVariant.value,
		isLoading: isProductDetailsLoading.value,
	}
})

const sliderAttributes = computed(() => {
	if (!isReady.value) return {}

	return {
		imagesList: activeProductVariant.value?.images,
	}
})

// ----------------------------------------------------------------------

const fetchAll = async (id, signal) => {
	await getProductDetails(id, signal)

	syncActiveVariant()

	if (productDetailsValue.value?.category && productDetailsValue.value?.style) {
		getSameProducts(
			productDetailsValue.value.category._id,
			productDetailsValue.value.style._id,
			signal,
		)
	}
}

// ----------------------------------------------------------------------
// watchers

watch(
	() => props.id,
	async (newId) => {
		const { signal } = useWatcherAbortController()
		await fetchAll(newId, signal)
	},
)

watch(
	() => props.variant,
	() => {
		syncActiveVariant()
	},
)

watch(locale, async () => {
	const { signal } = useWatcherAbortController()

	await fetchAll(props.id, signal)

	if (activeProductVariant.value?.title) {
		router.replace({
			name: route.name,
			params: {
				...route.params,
				slug: slugify(activeProductVariant.value.title),
			},
		})
	}
})

watch(currency, async () => {
	const { signal } = useWatcherAbortController()
	await fetchAll(props.id, signal)
})

// ----------------------------------------------------------------------

onMounted(async () => {
	await fetchAll(props.id)
	getReviews()
})

onUnmounted(clearProductDetails)

// ----------------------------------------------------------------------

const onVariantChange = (newColorId) => {
	const variant = productDetailsValue.value?.variants?.find(
		(v) => v.color._id === newColorId,
	)

	if (!variant) return

	router.replace({
		name: route.name,
		params: {
			...route.params,
			variant: variant._id,
		},
	})
}

const onFormSubmit = ({ count, size }) => {
	addToCart({
		product: props.id,
		variant: props.variant,
		size,
		quantity: count,
	})
}

const reloadSameProducts = () => {
	if (!productDetailsValue.value?.category || !productDetailsValue.value?.style)
		return

	getSameProducts(
		productDetailsValue.value.category._id,
		productDetailsValue.value.style._id,
	)
}
</script>
