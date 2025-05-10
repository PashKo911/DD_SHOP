<template>
	<div
		class="flex w-full flex-col-reverse gap-6 overflow-hidden p-2.5 sm:aspect-[830/590] sm:flex-row sm:p-5 lg:max-w-[51.875rem]"
	>
		<Swiper
			:modules="modules"
			spaceBetween="20"
			slidesPerView="3"
			:autoHeight="true"
			:direction="thumbSwiperDirection"
			loop
			@swiper="setThumbsSwiper"
			data-thumb-swiper
			class="max-w-full cursor-pointer sm:basis-[23.631841%] [&_.swiper-button-prev]:hidden"
		>
			<SwiperSlide v-for="i in imagesList" :key="i.id" class="">
				<div
					class="[.swiper-slide-thumb-active_&]:outline-primary flex h-full items-center justify-center rounded-lg bg-[#FCF9F6] outline outline-offset-5 outline-transparent transition-colors max-sm:aspect-square sm:outline-offset-10 [.swiper-slide-visible_&]:shadow-lg"
				>
					<img
						:src="i.imgSrc"
						alt="Image"
						class="aspect-square w-[74.210526%]"
					/>
				</div>
			</SwiperSlide>
		</Swiper>
		<Swiper
			:modules="modules"
			loop
			:zoom="{
				enabled: true,
				limitToOriginalSize: true,
				pan: true,
			}"
			:thumbs="{ swiper: thumbsSwiper }"
			:navigation="{ prevEl: '.btn-prev', nextEl: '.btn-next' }"
			@swiper="setMainSwiper"
			class="group max-w-full min-w-0 rounded-lg shadow-lg max-sm:aspect-square sm:basis-[76.243781%]"
		>
			<SwiperSlide
				v-for="i in imagesList"
				:key="i.id"
				class="overflow-hidden bg-[#FCF9F6]"
			>
				<div
					class="swiper-zoom-container flex h-full items-center justify-center"
				>
					<img
						:src="i.imgSrc"
						alt="Image"
						class="w-[74.225122%] max-sm:aspect-square"
					/>
				</div>
			</SwiperSlide>
			<div class="absolute inset-0 overflow-hidden">
				<slider-nav-button
					@click="mainSwiper.slidePrev()"
					:aria-label="t('buttons.prevSlide')"
					class="any-hover:-translate-x-full any-hover:opacity-0 absolute top-1/2 left-2 -translate-y-1/2 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100"
				>
					<arrow-left-icon />
				</slider-nav-button>
				<slider-nav-button
					@click="mainSwiper.slideNext()"
					:aria-label="t('buttons.prevSlide')"
					class="any-hover:translate-x-full any-hover:opacity-0 absolute top-1/2 right-2 -translate-y-1/2 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100"
				>
					<arrow-right-icon />
				</slider-nav-button>
			</div>
		</Swiper>
	</div>
</template>

<script setup>
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'

import 'swiper/css'
import 'swiper/css/zoom'

import { ref, computed } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Zoom } from 'swiper/modules'
import SliderNavButton from './SliderNavButton.vue'

defineProps({
	imagesList: {
		type: Array,
		required: true,
	},
})

const thumbsSwiper = ref(null)
const mainSwiper = ref(null)
const { t } = useI18n()

const setThumbsSwiper = (swiperInstance) => {
	thumbsSwiper.value = swiperInstance
}

const setMainSwiper = (swiperInstance) => {
	mainSwiper.value = swiperInstance
}

const modules = [Thumbs, Zoom]

const isMobileSmall = useMediaQuery('(max-width: 479.98px)')

const thumbSwiperDirection = computed(() => {
	return isMobileSmall.value ? 'horizontal' : 'vertical'
})
</script>

<style scoped>
[data-thumb-swiper].swiper {
	overflow: visible;
}
</style>
