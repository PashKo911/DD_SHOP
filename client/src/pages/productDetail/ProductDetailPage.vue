<template>
	<section
		class="lg:gx-lg-80-12 not-last:mb-100-60 flex flex-col items-start justify-between gap-x-4 gap-y-10 lg:flex-row"
	>
		<component
			:is="activeThumbSwiperComponent"
			v-bind="descriptionAttributes"
			class="lg:shrink-0 lg:basis-[max(40%,_32.5rem)]"
		/>
		<component
			:is="activeDescriptionComponent"
			v-bind="sliderAttributes"
			@change-variant="onVariantChange"
			class="w-full lg:grow"
		/>
	</section>

	<product-detail-tabs :reviews="reviews" class="not-last:mb-100-60" />

	<section>
		<div>
			<h2
				class="font-heading not-last:mb-50-30 text-50-28 leading-tight font-semibold uppercase"
			></h2>
		</div>
		<!-- <slider-base
			:items="sliderData"
			:title="t('pages.productDetail.title.sameProductsSection')"
		/> -->
	</section>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { computed, watch, onMounted, ref, onUnmounted } from 'vue'
import slugify from '@sindresorhus/slugify'

import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import { useRouter, useRoute } from 'vue-router'

import { reviews } from '@/data/reviews'
import sliderData from '@/data/sliderData'
import { DEFAULT_LOCALE } from '@/constants/config'

import SliderThumb from '@/components/sliders/sliderThumb/SliderThumb.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import ProductDescription from './productDescription/ProductDescription.vue'
import ProductDetailTabs from './ProductDetailTabs.vue'
import SliderThumbSkeleton from '@/components/sliders/sliderThumb/SliderThumbSkeleton.vue'
import ProductDescriptionSkeleton from './productDescription/ProductDescriptionSkeleton.vue'

const props = defineProps({
	locale: {
		type: String,
		default: DEFAULT_LOCALE,
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
})

const productsStore = useProductsStore()
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const { getProductDetails, clearProductDetails } = productsStore
const {
	productDetailsValue,
	isProductDetailsLoading,
	isProductDetailsLoaded,
	hasProductDetailError,
} = storeToRefs(productsStore)
//========================================================================================================================================================

const activeProductVariant = computed(() => {
	if (!isProductDetailsLoaded.value || !productDetailsValue.value.variants)
		return null
	const colors = productDetailsValue.value.variants.map((v) => v.color)

	const activeVariant = productDetailsValue.value.variants.find(
		({ _id }) => _id === props.variant,
	)

	if (!activeVariant) return null

	const { variants, ...restProduct } = productDetailsValue.value
	return { colors, ...restProduct, ...activeVariant }
})

const activeThumbSwiperComponent = computed(() => {
	return isProductDetailsLoading.value || !isProductDetailsLoaded.value
		? SliderThumbSkeleton
		: SliderThumb
})
const sliderAttributes = computed(() => {
	if (isProductDetailsLoading.value || !isProductDetailsLoaded.value) {
		return {}
	}
	return {
		productData: activeProductVariant.value,
		altImageAttr: activeProductVariant?.value.title,
	}
})
const activeDescriptionComponent = computed(() => {
	return isProductDetailsLoading.value || !isProductDetailsLoaded.value
		? ProductDescriptionSkeleton
		: ProductDescription
})
const descriptionAttributes = computed(() => {
	if (isProductDetailsLoading.value || !isProductDetailsLoaded.value) {
		return {}
	}
	return { imagesList: activeProductVariant.value.images }
})
//========================================================================================================================================================

watch(locale, async () => {
	await getProductDetails(props.id)
	router.replace({
		name: route.name,
		params: {
			...route.params,
			slug: slugify(activeProductVariant.value.title),
		},
	})
})

onMounted(async () => {
	await getProductDetails(props.id)
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
</script>
