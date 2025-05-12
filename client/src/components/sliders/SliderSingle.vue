<template>
	<Swiper
		loop
		@swiper="setSlider"
		:autoplay="{
			delay: 4000,
			pauseOnMouseEnter: true,
		}"
		:modules="modules"
		class="group relative"
	>
		<swiper-slide v-for="item in items" :key="item.id" data-base-slider-slide>
			<slot :item="item">
				<div>
					<img :src="item.img" :alt="t(item.label)" />
				</div>
			</slot>
		</swiper-slide>
		<div class="absolute inset-0 z-10 container">
			<button
				type="button"
				:aria-label="t('buttons.prevSlide')"
				@click="slider.slidePrev()"
				class="focus-visible:outline-t-inverse-hover group any-hover:-translate-x-1/2 any-hover:opacity-0 absolute top-1/2 left-1.5 -translate-y-1/2 cursor-pointer rounded-md bg-black/30 p-3 outline outline-transparent transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100 md:p-4"
			>
				<arrow-left-triangle
					class="w-41-10 aspect-[41/70] transition-transform hover:scale-110"
				/>
			</button>
			<button
				type="button"
				:aria-label="t('buttons.prevSlide')"
				@click="slider.slideNext()"
				class="focus-visible:outline-t-inverse-hover any-hover:translate-x-1/2 any-hover:opacity-0 absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer rounded-md bg-black/30 p-3 outline outline-transparent transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100 md:p-4"
			>
				<arrow-right-triangle
					class="w-41-10 aspect-[41/70] transition-transform hover:scale-110"
				/>
			</button>
		</div>
	</Swiper>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Autoplay } from 'swiper/modules'

import 'swiper/css'

import { Swiper, SwiperSlide } from 'swiper/vue'
import ArrowLeftTriangle from '../icons/ArrowLeftTriangle.vue'
import ArrowRightTriangle from '../icons/ArrowRightTriangle.vue'

const { t } = useI18n()

const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
})

const slider = ref(null)

const setSlider = (sliderInstance) => {
	slider.value = sliderInstance
}

const modules = [Autoplay]
</script>
