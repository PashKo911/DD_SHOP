<template>
	<home-hero-section class="pb-80-30 pt-10 lg:pt-14" />
	<div class="not-last:mb-80-50">
		<slider-single :items="specialOfferItems" />
		<div class="py-50-15 bg-primary relative z-20 -mt-[.0625rem]">
			<ul
				class="container flex flex-wrap items-center justify-around gap-2 md:justify-between md:gap-4"
			>
				<li
					v-for="p in fashionPartners"
					:key="p"
					class="font-heading text-creamy-cloud text-80-20 leading-tight font-semibold uppercase"
				>
					{{ p }}
				</li>
			</ul>
		</div>
	</div>
	<div class="not-last:mb-80-50 container">
		<slider-base
			:items="newestProductsValue"
			:title="t('pages.home.sectionTitles.newArrivals')"
			:is-loading="isNewestProductsLoading"
			:has-error="hasNewestProductsError"
			@reload-items="onReloadNewestProducts"
		/>
	</div>
	<div class="not-last:mb-80-50">
		<img
			src="@/assets/img/hero/black-friday-section.webp"
			:alt="t('pages.home.sectionTitles.blackFriday')"
			width="1920"
			height="480"
			loading="lazy"
		/>
	</div>
	<div class="not-last:mb-100-60 container">
		<slider-base
			:items="topSalesProductsValue"
			:title="t('pages.home.sectionTitles.topSelling')"
			:is-loading="isTopSalesProductsLoading"
			:has-error="hasTopSalesProductsError"
			@reload-items="onReloadTopSalesProducts"
		/>
	</div>
	<div class="not-last:mb-100-60 container">
		<home-dress-style-section
			:items="availableStylesValue"
			:is-loading="isAvailableStylesLoading"
			:has-error="hasAvailableStylesError"
			@reload-items="onReloadAvailableStyles"
		/>
	</div>
	<div class="not-last:mb-80-50">
		<img
			src="@/assets/img/hero/new-collection.webp"
			:alt="t('pages.home.imgAltAttr.newCollection')"
			loading="lazy"
			width="1920"
			height="480"
		/>
	</div>
	<div class="not-last:mb-80-50 container">
		<slider-base
			:items="reviewsValue"
			:title="t('pages.home.sectionTitles.reviews')"
			:is-loading="isReviewsLoading"
			:has-error="hasReviewsError"
			@reload-items="onReloadReviews"
		>
			<template #default="{ item }">
				<component :is="activeReviewsSliderComponent" :review-data="item" />
			</template>
		</slider-base>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, watch, computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import { useReviewsStore } from '@/stores/reviews'
import { useFacetOptionsStore } from '@/stores/facetOptions'

import specialOfferItems from '@/data/specialOfferItems'
import fashionPartners from '@/data/fashionPartners'

import ReviewCard from '@/components/cards/reviewCard/ReviewCard.vue'
import ReviewCardSkeleton from '@/components/cards/reviewCard/ReviewCardSkeleton.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import HomeHeroSection from './HomeHeroSection.vue'
import SliderSingle from '@/components/sliders/SliderSingle.vue'
import HomeDressStyleSection from './HomeDressStyleSection.vue'

const { t, locale } = useI18n()

const productsStore = useProductsStore()
const reviewsStore = useReviewsStore()
const facetOptionStore = useFacetOptionsStore()

const {
	availableStylesValue,
	isAvailableStylesLoading,
	hasAvailableStylesError,
} = storeToRefs(facetOptionStore)
const { getAvailableStyles } = facetOptionStore

const {
	newestProductsValue,
	topSalesProductsValue,
	isTopSalesProductsLoading,
	isNewestProductsLoading,
	hasNewestProductsError,
	hasTopSalesProductsError,
} = storeToRefs(productsStore)
const { getNewestProducts, getTopSalesProducts } = productsStore

const { getReviews } = reviewsStore
const { reviewsValue, isReviewsLoading, hasReviewsError } =
	storeToRefs(reviewsStore)

const activeReviewsSliderComponent = computed(() => {
	return isReviewsLoading.value ? ReviewCardSkeleton : ReviewCard
})

watch(locale, async () => {
	await Promise.allSettled([
		getNewestProducts(),
		getTopSalesProducts(),
		getAvailableStyles(),
	])
})

const onReloadNewestProducts = async () => {
	await getNewestProducts()
}

const onReloadTopSalesProducts = async () => {
	await getTopSalesProducts()
}

const onReloadAvailableStyles = async () => {
	await getAvailableStyles()
}

const onReloadReviews = async () => {
	await getReviews()
}

onMounted(async () => {
	await Promise.allSettled([
		getNewestProducts(),
		getTopSalesProducts(),
		getAvailableStyles(),
		getReviews(),
	])
})
</script>
