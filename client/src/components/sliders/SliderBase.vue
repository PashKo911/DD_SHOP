<template>
	<section>
		<div class="not-last:mb-50-30 flex items-start justify-between gap-8">
			<h2 class="font-heading text-50-28 leading-tight font-semibold uppercase">
				{{ title }}
			</h2>
			<div class="hidden items-center gap-4 sm:flex">
				<slider-nav-button
					@click="slider.slidePrev()"
					:aria-label="t('buttons.prevSlide')"
					class="bg-[#FCF9F6] shadow-lg hover:shadow-md"
				>
					<arrow-left-icon />
				</slider-nav-button>
				<slider-nav-button
					@click="slider.slideNext()"
					:aria-label="t('buttons.nextSlide')"
					class="bg-[#FCF9F6] shadow-lg hover:shadow-md"
				>
					<arrow-right-icon />
				</slider-nav-button>
			</div>
		</div>
		<Swiper
			loop
			:initial-slide="1"
			:breakpoints="breakpoints"
			@swiper="setSlider"
			data-base-slider
			class="relative"
		>
			<span
				class="absolute top-0 -left-4 z-20 hidden h-full w-screen -translate-x-full backdrop-blur-[.1563rem] xl:block"
			></span>
			<swiper-slide
				v-for="item in items"
				:key="item._id"
				data-base-slider-slide
				class="h-auto"
			>
				<slot :item="item">
					<card-slider :data="item" />
				</slot>
			</swiper-slide>
			<span
				class="absolute top-0 -right-4 z-20 hidden h-full w-screen translate-x-full backdrop-blur-[.1563rem] xl:block"
			></span>
		</Swiper>
	</section>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Swiper, SwiperSlide } from 'swiper/vue'
import SliderNavButton from './SliderNavButton.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import CardSlider from '../cards/CardSlider.vue'

import 'swiper/css'

const props = defineProps({
	title: {
		type: String,
		default: 'Title',
	},
	items: {
		type: Array,
		required: true,
	},
})

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

const { t } = useI18n()

const slider = ref(null)

const setSlider = (swiperInstance) => {
	slider.value = swiperInstance
}
</script>

<style scoped>
/* @media (min-width: 479.98px) { */
[data-base-slider-slide].swiper-slide {
	height: auto;
}
/* } */

[data-base-slider].swiper {
	overflow: visible;
}
</style>
