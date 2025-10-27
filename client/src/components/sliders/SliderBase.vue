<template>
	<section>
		<div class="not-last:mb-50-30 flex items-start justify-between gap-8">
			<h2 class="font-heading text-50-28 leading-tight font-semibold uppercase">
				{{ title }}
			</h2>
			<div class="hidden items-center gap-4 sm:flex">
				<slider-nav-button
					:disabled="hasError || isLoading"
					@click="slider.slidePrev()"
					:aria-label="t('buttons.prevSlide')"
				>
					<arrow-left-icon class="aspect-square w-8" />
				</slider-nav-button>
				<slider-nav-button
					@click="slider.slideNext()"
					:disabled="hasError || isLoading"
					:aria-label="t('buttons.nextSlide')"
					class="bg-[#FCF9F6] shadow-lg hover:shadow-md"
				>
					<arrow-right-icon class="aspect-square w-8" />
				</slider-nav-button>
			</div>
		</div>
		<ErrorMessageBlock
			v-if="isErrorBlockVisible"
			:is-loading="isLoading"
			@reload-items="$emit('reloadItems')"
		/>
		<swiper
			v-else
			:breakpoints="breakpoints"
			data-base-slider
			loop
			:preload-images="false"
			@swiper="setSlider"
			class="relative"
		>
			<span
				class="absolute top-0 -left-4 z-20 hidden h-full w-screen -translate-x-full backdrop-blur-[.1563rem] xl:block"
			></span>
			<swiper-slide
				v-for="(item, idx) in isLoading ? itemsCount : items"
				:key="isLoading ? idx : item._id"
				data-base-slider-slide
				class="h-auto"
			>
				<slot :item="item">
					<component :is="activeComponent" :data="isLoading ? {} : item" />
				</slot>
			</swiper-slide>
			<span
				class="absolute top-0 -right-4 z-20 hidden h-full w-screen translate-x-full backdrop-blur-[.1563rem] xl:block"
			></span>
		</swiper>
	</section>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Swiper, SwiperSlide } from 'swiper/vue'
import SliderNavButton from './SliderNavButton.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import ProductCard from '@/components/cards/productCard/ProductCard.vue'
import ProductCardSkeleton from '@/components/cards/productCard/ProductCardSkeleton.vue'
import ErrorMessageBlock from '@/components/errorMessageBlock/ErrorMessageBlock.vue'

import 'swiper/css'

const breakpoints = {
	320: {
		slidesPerView: 1.2,
		spaceBetween: 20,
	},
	480: {
		slidesPerView: 2,
		spaceBetween: 20,
	},
	768: {
		slidesPerView: 3,
		spaceBetween: 20,
	},
	992: {
		slidesPerView: 4,
		spaceBetween: 20,
	},
	1440: {
		slidesPerView: 4,
		spaceBetween: 30,
	},
	1660: {
		slidesPerView: 4,
		spaceBetween: 50,
	},
}

const props = defineProps({
	title: {
		type: String,
		default: 'Title',
	},
	items: {
		type: Array,
		default: [],
	},
	itemsCount: {
		type: Number,
		default: 15,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	hasError: {
		type: Boolean,
		default: false,
	},
})

defineEmits(['reloadItems'])

const { t } = useI18n()

const slider = ref(null)

const activeComponent = computed(() => {
	return props.isLoading ? ProductCardSkeleton : ProductCard
})

const isErrorBlockVisible = computed(() => {
	return (props.hasError || !props.items.length) && !props.isLoading
})

const setSlider = (swiperInstance) => {
	if (props.items.length) {
		slider.value = swiperInstance
	}
}
</script>

<style scoped>
[data-base-slider-slide].swiper-slide {
	height: auto;
}

[data-base-slider].swiper {
	overflow: visible;
}
</style>
